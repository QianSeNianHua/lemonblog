/*
 * @Author: xzt
 * @Date: 2019-12-15 00:49:25
 * @Last Modified by: xzt
 * @Last Modified time: 2020-03-06 17:48:08
 */
import * as JWT from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Token
 */
export default class Token {
  constructor () {
    this.privateKey = fs.readFileSync(path.join(__dirname, '../lib/key/privateKey.pem'));
    this.publicKey = fs.readFileSync(path.join(__dirname, '../lib/key/publicKey.pem'));
    this.alg = 'RS256';
    this.exp = 1000 * 60 * 60; // 过期时间 60 分钟
  }

  private privateKey: Buffer; // 私钥
  private publicKey: Buffer; // 公钥
  private alg = '';  // 加密方式
  private exp = 0; // 单位毫秒

  /**
   * 生成token
   * @param data 数据
   * @param exp 过期时间，单位天数
   */
  generateToken (data: object, exp = 1) {
    const iat = new Date().getTime();

    let token = JWT.sign({
      iat, // 签发时间
      exp: iat + 1000 * 60 * 60 * 24 * exp, // 过期时间
      ...data
    }, this.privateKey, {
      algorithm: this.alg
    });

    return token;
  }

  /**
   * 验证token
   * @param token token
   */
  verifyToken (token: string) {
    let result: any = JWT.verify(token, this.publicKey, {
      algorithms: [ this.alg ]
    });

    let time = Date.now();

    if (time <= result.exp) {
      // 有效期
      return { ...result };
    } else {
      // 过期
      return false;
    }
  }
}
