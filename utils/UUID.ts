/*
 * @Author: xzt
 * @Date: 2020-04-24 14:10:05
 * @Last Modified by: xzt
 * @Last Modified time: 2020-04-24 16:03:20
 */
import * as uuid from 'uuid/v4';

/**
 * 获取uuid
 * @param {number=} count 获取多少位
 */
export function UUID4 (count?: number | undefined) {
  let str: string = uuid();

  str = str.replace('-', '');
  str = str.substr(0, count);

  return str;
}
