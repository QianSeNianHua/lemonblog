import { Context } from 'egg';
import { CodeNum, CodeMsg } from '../../utils/ResponseWrapper';

/**
 * 单一登录
 */
module.exports = (_options, _app) => {
  return async function remoteLogin (ctx: Context, next) {
    const userUUID = ctx.middleParams.userUUID;
    const oldClientID = ctx.middleParams.clientID;
    let strClientID = await ctx.app.redis.get(`userUUID:${userUUID}`) as string;
    let newClientID;

    try {
      newClientID = JSON.parse(strClientID).clientID;
    } catch (error) {
      // 异地登录，需要重新登录
      ctx.throw(CodeNum.API_ERROR, CodeMsg.API_ERROR);
    }

    if (newClientID !== oldClientID) {
      // 异地登录，需要重新登录
      ctx.throw(CodeNum.API_ERROR, CodeMsg.API_ERROR);
    } else {
      await next();
    }
  };
};
