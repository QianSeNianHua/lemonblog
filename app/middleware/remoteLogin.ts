import { Context } from 'egg';
import { CodeNum, CodeMsg } from '../../utils/ResponseWrapper';

/**
 * 单一登录
 */
module.exports = (_options, _app) => {
  return async function remoteLogin (ctx: Context, next) {
    const userUUID = ctx.middleParams.userUUID;
    const newClientID = ctx.middleParams.clientID;
    let res;
    let oldClientID;
    try {
      res = await ctx.app.redis.get(`userUUID:${userUUID}`) as string;
      oldClientID = JSON.parse(res).clientID;
    } catch (error) {
      // 异地登录，需要重新登录
      ctx.throw(CodeNum.API_REFUSE, CodeMsg.API_REFUSE);
    }

    if (newClientID !== oldClientID) {
      // 异地登录，需要重新登录
      ctx.throw(CodeNum.API_REFUSE, CodeMsg.API_REFUSE);
    } else {
      await next();
    }
  };
};
