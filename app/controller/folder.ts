import { Controller } from 'egg';
import { rd } from '../../lib/routerDecorate/index';

/**
 * 分类文件夹
 */
@rd.prefix('/folder')
export default class Folder extends Controller {
  /**
   * 用户登录
   */
  @rd.post('/getFolderList')
  public async getFolderList () {
    const { ctx, service } = this;

    ctx.body = await service.folderShell.getFolderList();
  }
}
