import { Controller } from 'egg';
import { rd } from '../../lib/routerDecorate/index';

/**
 * 用户
 */
@rd.prefix('/user')
export default class User extends Controller {
  /**
   * 用户登录
   */
  @rd.post('/login')
  public async login () {
    const { ctx, service } = this;

    ctx.body = await service.userEnter.login();
  }

  /**
   * 首页获取用户信息
   */
  @rd.post('/homeInfo')
  public async homeInfo () {
    const { ctx, service } = this;

    ctx.body = await service.userEnter.getUserInfo('home');
  }

  /**
   * 获取用户详细信息
   */
  @rd.post('/userInfo')
  public async userInfo () {
    const { ctx, service } = this;

    ctx.body = await service.userEnter.getUserInfo('user');
  }

  /**
   * 用户注册
   */
  @rd.post('/registered')
  public async registered () {
    const { ctx, service } = this;

    ctx.body = await service.userEnter.registered();
  }

  /**
   * 修改密码
   */
  @rd.post('/resetpw')
  public async resetPassword () {
    const { ctx, service } = this;

    ctx.body = await service.userEnter.resetPassword();
  }

  /**
   * 密码找回
   */
  @rd.post('/recover')
  public async recover () {
    const { ctx, service } = this;

    ctx.body = '密码找回';
  }
}
