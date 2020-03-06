import { Context } from 'egg';
import Token from '../../utils/Token';
import { CodeNum, CodeMsg } from '../../utils/ResponseWrapper';

/**
 * 接口请求时，需要进行token验证
 */
module.exports = (_options, _app) => {

  return async function verifyToken (ctx: Context, next) {
    const token = ctx.request.header.authorization;
    let res;

    try {
      res = new Token().verifyToken(token);
    } catch (error) {
      // token验证不合法，跳转到登录页面
      ctx.throw(CodeNum.API_ERROR, CodeMsg.API_ERROR);
    }

    if (!res) {
      // token验证过期，跳转到登录页面
      // ctx.redirect() 重定向
      ctx.throw(CodeNum.API_ERROR, CodeMsg.API_ERROR);
    } else {
      ctx.middleParams = {
        userUUID: res.userUUID,
        clientID: res.clientID
      };
      await next();
    }
  };
};
