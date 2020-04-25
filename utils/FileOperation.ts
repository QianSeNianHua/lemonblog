/*
 * @Author: xzt
 * @Date: 2020-04-24 13:55:00
 * @Last Modified by: xzt
 * @Last Modified time: 2020-04-24 16:34:09
 */
import * as fs from 'fs';
import * as path from 'path';

// file文件路径
const fileUrl = path.join(__dirname, '../files/');

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
 * 删除文件
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
