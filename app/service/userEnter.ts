/*
 * @Author: xzt
 * @Date: 2019-12-15 00:49:12
 * @Last Modified by: xzt
 * @Last Modified time: 2020-04-24 13:53:06
 */
import { Service, Context } from 'egg';
import sequelize from 'sequelize';
import { ResponseWrapper, CodeNum, CodeMsg } from '../../utils/ResponseWrapper';
import Token from '../../utils/Token';
import * as uuid from 'uuid/v4';
import { generalVerify, compareVerify } from '../../utils/Verify';

export default class UserEnter extends Service {
  constructor (ctx: Context) {
    super(ctx);

    this.data = ctx.request.body;
  }

  private data; // 请求数据

  /**
   * 用户登录
   */
  async login () {
    return await this.classicsLogin();
  }

  /**
   * 经典登录
   * @param {string} account 账户
   * @param {string} password 密码
   * @param {string} verify 验证码
   * @param {boolean} state 七天免登录，true表示启用
   */
  private async classicsLogin () {
    // 校验参数
    this.ctx.validate({
      account: {
        type: 'string',
        required: true
      },
      password: {
        type: 'string',
        required: true
      },
      verify: {
        type: 'string',
        required: true
      },
      state: {
        type: 'boolean',
        required: true
      }
    });

    let res;
    const code = this.ctx.session.code + ''; // 正确的验证码
    const verify = this.data.verify + ''; // 传进来的验证码
    const state = this.data.state;

    // 判断验证码
    if (!compareVerify(code, verify)) {
      res = ResponseWrapper.mark(CodeNum.ERROR, '验证码错误', { }).toString();

      return res;
    }

    // 判断账户密码
    try {
      const account = this.data.account;
      const password = this.data.password;

      res = await this.ctx.model.User.findOne({
        raw: true,
        attributes: [[ (sequelize.fn('count', sequelize.col('userId')) as any), 'count' ], 'userUUID', 'userId' ],
        where: {
          account,
          password
        }
      });
    } catch (error) {
      throw new Error(error);
    }

    if (res.count === 1) {
      // 登录成功

      // 生成客户端唯一地址
      const clientID = uuid();

      // 生成token
      const token = new Token().generateToken({
        userId: res.userId,
        userUUID: res.userUUID,
        clientID
      }, state ? 7 : 1);

      // 存入redis
      // expiryMode(过期模式): ex秒级时间, px毫秒级时间
      // time: 过期时间
      // setMode(模式设置): nx键不存在才设置成功, xx键存在才设置成功
      await this.app.redis.set(`userUUID:${res.userUUID}`, JSON.stringify({ clientID }), 'ex', 15 * 24 * 60 * 60);

      res = ResponseWrapper.mark(CodeNum.SUCCESS, '登录成功', { token }).toString();
    } else {
      // 登录失败
      res = ResponseWrapper.mark(CodeNum.ERROR, '用户名或密码错误', { }).toString();
    }

    return res;
  }

  /**
   * 获取验证码
   */
  public async getVerify () {
    const captcha = generalVerify();

    this.ctx.session.code = captcha.text;

    return captcha;
  }

  /**
   * 获取用户信息
   * type: home 或 user
   * @param userUUID 用户的uuid
   */
  public async getUserInfo (type: string) {
    const attr: string[] = [ ];
    if (type === 'user') {
      // 获取详细信息
      attr.push('userId', 'password');
    } else {
      // 只获取部分信息
      attr.push('userId', 'password', 'otherLogin', 'account', 'createTime');
    }

    let res = await this.ctx.model.User.findOne({
      raw: true,
      attributes: {
        exclude: attr
      },
      where: {
        userUUID: this.data.userUUID
      }
    });

    return ResponseWrapper.mark(CodeNum.SUCCESS, CodeMsg.SUCCESS, res || { }).toString();
  }

  /**
   * 用户注册
   * @param {string} account 账户
   * @param {string} password 密码
   * @param {string} nickname 昵称
   *
   */
  public async registered () {
    // 检查参数
    if (!this.data.password || !this.data.nickname) {
      this.ctx.throw(500, `${CodeMsg.NO_PARAM}: account, password, nickname。`);
    }

    let acc = await this.ctx.model.User.findOne({
      where: {
        account: this.data.account
      }
    });

    if (acc) {
      // 账号存在
      return ResponseWrapper.mark(CodeNum.ERROR, '账号已存在', { }).toString();
    }

    await this.ctx.model.User.create({
      account: this.data.account,
      password: this.data.password,
      nickname: this.data.nickname
    } as any);

    return ResponseWrapper.mark(CodeNum.SUCCESS, CodeMsg.SUCCESS, { }).toString();
  }

  /**
   * 修改用户信息
   * @param {number} userId 用户唯一id(token获取)
   * @param {string} nickname 用户昵称(可选)
   * @param {string} briefIntro 个性签名(可选)
   * @param {string} portraitURL 头像(可选)
   */
  public async modifyUserInfo () {
    // 检查参数
    this.ctx.validate({
      nickname: {
        type: 'string',
        required: false
      },
      briefIntro: {
        type: 'string',
        required: false
      },
      portraitURL: {
        type: 'string',
        required: false
      }
    });

    await this.ctx.model.User.update({
      nickname: this.data.nickname,
      briefIntro: this.data.briefIntro,
      portraitURL: this.data.portraitURL
    }, {
      where: {
        userId: this.ctx.middleParams.userId
      }
    });

    return ResponseWrapper.mark(CodeNum.SUCCESS, CodeMsg.SUCCESS, { }).toString();
  }

  /**
   * 重置密码
   * @param {number} userId 用户唯一id(token获取)
   * @param {string} oldPassword 旧密码
   * @param {string} newPassword 新密码
   */
  public async resetPassword () {
    // 检查参数
    this.ctx.validate({
      oldPassword: {
        type: 'string',
        required: true
      },
      newPassword: {
        type: 'string',
        required: true
      }
    });

    let pw = await this.ctx.model.User.findOne({
      where: {
        userUUID: this.ctx.middleParams.userUUID,
        password: this.data.oldPassword
      }
    });

    if (!pw) {
      // 密码不正确
      return ResponseWrapper.mark(CodeNum.ERROR, '密码不正确', { }).toString();
    }

    await this.ctx.model.User.update({
      password: this.data.newPassword
    }, {
      where: {
        userUUID: this.ctx.middleParams.userUUID
      }
    });

    return ResponseWrapper.mark(CodeNum.SUCCESS, CodeMsg.SUCCESS, { }).toString();
  }
}
