/*
 * @Author: xzt
 * @Date: 2020-04-23 16:25:56
 * @Last Modified by: xzt
 * @Last Modified time: 2020-04-23 16:32:31
 */
import * as svgCaptcha from 'svg-captcha';

/**
 * 生成验证码
 */
export function generalVerify () {
  const captcha = svgCaptcha.create({
    size: 4,
    fontSize: 50,
    width: 100,
    height: 40,
    background: '#cc9966'
  });

  return {
    text: captcha.text,
    data: captcha.data
  };
}

/**
 * 比较验证码
 * @param {string} oldCode 正确的验证码
 * @param {string} newCode 接口提交的验证码
 */
export function compareVerify (oldCode, newCode) {
  return oldCode.toLocaleLowerCase() === newCode.toLocaleLowerCase();
}
