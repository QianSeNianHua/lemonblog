import { Context } from 'egg';
import { CodeNum, CodeMsg } from '../../utils/ResponseWrapper';

/**
 * 单一登录
 */
module.exports = (_options, _app) => {
  return async function remoteLogin (ctx: Context, next) {
    const userUUID = ctx.middleParams.userUUID;
    const oldClientID = ctx.middleParams.clientID;
    const newClientID = JSON.parse(await ctx.app.redis.get(`userUUID:${userUUID}`) as string);

    if (newClientID !== oldClientID) {
      // 异地登录，需要重新登录
      ctx
    } else {
      await next()
    }
  }
}
