/*
 * @Author: xzt
 * @Date: 2019-12-19 13:52:27
 * @Last Modified by: xzt
 * @Last Modified time: 2020-05-22 13:35:42
 */
import { Controller } from 'egg';
import { rd } from '../../lib/routerDecorate/index';

/**
 * 分类文件夹接口
 */
@rd.prefix('/folder')
export default class Folder extends Controller {
  /**
   * 获取分类列表
   */
  @rd.post('/getFolderList')
  public async getFolderList () {
    const { ctx, service } = this;

    ctx.body = await service.folderShell.getFolderList();
  }

  /**
   * 新建/修改 分类文件夹
   */
  @rd.post('/createFolder', 'verifyToken', 'remoteLogin')
  public async createFolder () {
    const { ctx, service } = this;

    ctx.body = await service.folderShell.createFolder();
  }

  /**
   * 删除单个分类文件夹
   */
  @rd.post('/deleteFolder', 'verifyToken', 'remoteLogin')
  public async deleteFolder () {
    const { ctx, service } = this;

    ctx.body = await service.folderShell.deleteFolder();
  }

  /**
   * 获取分类文件夹信息
   */
  @rd.post('/getFolderInfo')
  public async getFolderInfo () {
    const { ctx, service } = this;

    ctx.body = await service.folderShell.getFolderInfo();
  }
}
