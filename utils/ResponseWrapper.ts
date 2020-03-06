/*
 * @Author: xzt
 * @Date: 2019-12-13 17:51:54
 * @Last Modified by: xzt
 * @Last Modified time: 2020-03-06 16:47:21
 */

/**
 * 统一接口返回格式
 */
export class ResponseWrapper {
  private _code;
  private _msg;
  private _data;

  get code () {
    return this._code;
  }
  set code (code) {
    this._code = code;
  }

  get msg () {
    return this._msg;
  }
  set msg (msg) {
    this._msg = msg;
  }

  get data () {
    return this._data;
  }
  set data (data) {
    this._data = data;
  }

  /**
   * 静态调用
   * @param code 状态码
   * @param msg 消息
   * @param data 数据
   */
  static mark (code: CodeNum, msg: CodeMsg | string, data: object) {
    let responseWrapper = new ResponseWrapper();
    responseWrapper.code = code;
    responseWrapper.msg = msg;
    responseWrapper.data = data;
    return responseWrapper;
  }

  toString () {
    return {
      code: this.code,
      data: this.data,
      msg: this.msg
    };
  }
}

/**
 * 返回码
 */
export enum CodeNum {
  SUCCESS = 0,
  WARN = 1,
  ERROR = 2,
  API_ERROR = 400,
  NO_PARAM = 500,
  NODATA = '0003',
  FEAILED = '0004',
  ACCOUNT_ERROR = '1000',
  API_NOT_EXISTS = '1001',
  API_NOT_PER = '1002',
  PARAMS_ERROR = '1004',
  SIGN_ERROR = '1005',
  AMOUNT_NOT_QUERY = '1010',
  API_DISABLE = '1011',
  UNKNOWN_IP = '1099',
  SYSTEM_ERROR = '9999'
}
/**
 * 返回信息
 */
export enum CodeMsg {
  SUCCESS = '查询成功',
  API_ERROR = '错误请求',
  NODATA = '查询成功无记录',
  FEAILED = '查询失败',
  NO_PARAM = '少了参数',
  ACCOUNT_ERROR = '账户不存在或被禁用',
  API_NOT_EXISTS = '请求的接口不存在',
  API_NOT_PER = '没有该接口的访问权限',
  PARAMS_ERROR = '参数为空或格式错误',
  SIGN_ERROR = '数据签名错误',
  AMOUNT_NOT_QUERY = '余额不够，无法进行查询',
  API_DISABLE = '查询权限已被限制',
  UNKNOWN_IP = '非法IP请求',
  SYSTEM_ERROR = '系统异常',
}
