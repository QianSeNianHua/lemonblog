import { Context } from 'egg';
import Token from '../../utils/Token';

module.exports = (_options, _app) => {

  return async function verifyToken (ctx: Context, next) {
    try {
      const token = ctx.request.header.authorization;

      const res = new Token().verifyToken(token);

      if (!res.type) {
        // 跳转到登录页面
        await next();
      } else {
        ctx.query.userUUID = res.userUUID;
        await next();
      }
    } catch (error) {
      throw new Error();
    }
  };
};
