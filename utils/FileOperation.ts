/*
 * @Author: xzt
 * @Date: 2020-04-24 13:55:00
 * @Last Modified by: xzt
 * @Last Modified time: 2020-05-14 14:06:53
 */
import * as fs from 'fs';
import * as path from 'path';

// file文件路径
const fileUrl = path.join('files/');

/**
 * readFile，writeFile 是把文件内容全部读入内存，再写入文件。针对小型文本文件
 * createReadStream，createWriteStream 是把文件先读入内存一部分，写一部分，是一点一点操作。针对大型音频、视频文件
 */

/**
 * 读取文件
 * @param {string} fileName 文件名称
 */
export async function readFile (fileName: string) {
  return new Promise((resolve, _reject) => {
    try {
      fs.readFile(fileUrl + fileName, 'utf-8', (err, data) => {
        if (err) {
          resolve('');
        } else {
          resolve(data.toString());
        }
      });
    } catch (error) {
      resolve('');
    }
  });
}

/**
 * 生成文件
 * @param {string} fileName 文件名称
 * @param {string} content 文章内容
 */
export async function writeFile (fileName: string, content: string) {
  return new Promise((resolve, reject) => {
    try {
      fs.writeFile(fileUrl + fileName, content, { encoding: 'utf-8', flag: 'w' }, err => {
        if (err) {
          reject();
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject();
    }
  });
}

/**
 * 异步删除文件
 * @param {string} fileName 文件名称
 */
export async function deleteFile (fileName: string) {
  return new Promise((resolve, reject) => {
    try {
      fs.unlink(fileUrl + fileName, err => {
        if (err) {
          reject();
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject();
    }
  });
}
