/*
 * @Author: xzt
 * @Date: 2019-12-15 00:49:12
 * @Last Modified by: xzt
 * @Last Modified time: 2020-02-01 16:13:59
 */
import { Service, Context } from 'egg';
import sequelize from 'sequelize';
import { ResponseWrapper, CodeNum, CodeMsg } from '../../utils/ResponseWrapper';
import Token from '../../utils/Token';

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
   * @param account 账户
   * @param password 密码
   */
  private async classicsLogin () {
    let res;

    try {
      const account = this.data.account;
      const password = this.data.password;

      res = await this.ctx.model.User.findOne({
        raw: true,
        attributes: [[ (sequelize.fn('count', sequelize.col('userId')) as any), 'count' ], 'userUUID' ],
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

      // 生成token
      const token = new Token().generateToken({
        userUUID: res.userUUID
      });

      res = ResponseWrapper.mark(CodeNum.SUCCESS, '登录成功', { token }).toString();
    } else {
      // 登录失败
      res = ResponseWrapper.mark(CodeNum.ERROR, '用户名或密码错误', { }).toString();
    }

    return res;
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
   * @param account 账户
   * @param password 密码
   * @param nickname 昵称
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
   * @param userUUID 用户唯一id
   * @param nickname 用户昵称
   * @param briefIntro 个性签名(可选)
   * @param portraitURL 头像(可选)
   */
  public async modifyUserInfo () {
    // 检查参数
    if (!this.data.nickname) {
      this.ctx.throw(CodeNum.NO_PARAM, `${CodeMsg.NO_PARAM}: nickname。`);
    }

    let res = await this.ctx.model.User.update({
      nickname: this.data.nickname || null,
      briefIntro: this.data.briefIntro || null,
      portraitURL: this.data.portraitURL || null
    }, {
      where: {
        userUUID: this.data.userUUID
      }
    });

    return ResponseWrapper.mark(CodeNum.SUCCESS, CodeMsg.SUCCESS, { }).toString();
  }

  /**
   * 重置密码
   * @param userUUID 用户唯一id
   * @param oldPassword 旧密码
   * @param newPassword 新密码
   */
  public async resetPassword () {
    // 检查参数
    if (!this.data.newPassword) {
      this.ctx.throw(500, `${CodeMsg.NO_PARAM}: newPassword。`);
    }

    let pw = await this.ctx.model.User.findOne({
      where: {
        userUUID: this.data.userUUID,
        password: this.data.oldPassword
      }
    });

    if (!pw) {
      // 密码不正确
      return ResponseWrapper.mark(CodeNum.ERROR, '密码不正确', { }).toString();
    }

    let t = await this.ctx.model.User.update({
      password: this.data.newPassword
    }, {
      where: {
        userUUID: this.data.userUUID
      }
    });

    return ResponseWrapper.mark(CodeNum.SUCCESS, CodeMsg.SUCCESS, { }).toString();
  }
}
