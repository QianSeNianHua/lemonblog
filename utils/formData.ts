import { isNullOrUndefined } from 'util';
import { UUID4 } from './UUID';
import * as path from 'path';

/*
 * @Author: xzt
 * @Date: 2020-05-13 14:28:34
 * @Last Modified by: xzt
 * @Last Modified time: 2020-05-14 11:03:04
 */

/**
 * 获取单个上传文件
 * egg-multipart 已经处理了文件二进制对象
 * @param {object} ctx
 * @param {function} callback 有文件流时才会调用
 */
export async function singleFile (ctx, callback) {
  const stream = await ctx.getFileStream();
  let res: {
    obj: {},
    files: any[]
  } = {
    obj: {},
    files: []
  };

  if (!isNullOrUndefined(stream)) {
    res.obj = { ...stream.fields };

    if (stream.filename) {
      // 文件名
      const fileName = UUID4(12) + path.extname(stream.filename);
      res.files.push(fileName);

      await callback(stream, fileName);
    }
  }

  return res;
}

/**
 * 获取多个上传文件
 * egg-multipart 已经处理了文件二进制对象
 * @param {object} ctx
 * @param {function} callback 有文件流时才会调用
 */
export async function multipleFile (ctx, callback) {
  const parts = ctx.multipart();
  let stream: any = null;
  let res: {
    obj: {},
    files: any[]
  } = {
    obj: {},
    files: []
  };

  while (!isNullOrUndefined(stream = await parts())) {
    if (stream.length) {
      res.obj[stream[0]] = stream[1];
    } else {
      if (!stream.filename) continue;

      // 文件名
      const fileName = UUID4(12) + path.extname(stream.filename);
      res.files.push(fileName);

      await callback(stream, fileName);
    }
  }

  return res;
}
