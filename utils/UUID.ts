/*
 * @Author: xzt
 * @Date: 2020-04-24 14:10:05
 * @Last Modified by: xzt
 * @Last Modified time: 2020-05-07 16:19:19
 */
import * as uuid from 'uuid/v4';

/**
 * 获取uuid
 * @param {number=} count 获取多少位
 */
export function UUID4 (count?: number | undefined) {
  let str: string = uuid();

  str = str.replace(/\-/g, '');
  str = str.substr(0, count);

  return str;
}
