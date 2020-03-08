import { Controller } from 'egg';
import { rd } from '../../lib/routerDecorate/index';

/**
 * 文章列表
 */
@rd.prefix('/file')
export default class File extends Controller {

  /**
   * 获取格式化后的文章列表
   */
  @rd.post('/getFileList')
  public async getFileList () {
    const { ctx, service } = this;

    ctx.body = await service.fileDocument.getFormatFileList();
  }

  /**
   * 搜索
   */
  @rd.post('/searchFiles')
  public async searchFiles () {
    const { ctx, service } = this;

    // ctx.body = await service.fileDocument.searchFiles();
    ctx.body = '搜索功能暂未开放';
  }

  /**
   * 获取文章内容
   */
  @rd.post('/getArticle')
  public async getArticle () {
    const { ctx, service } = this;

    ctx.body = await service.fileDocument.getArticle();
  }

  @rd.post('/getComment')
  public async getComment () {
    const { ctx, service } = this;

    ctx.body = await service.fileDocument.getComment();
  }

  @rd.post('/getAuthorComment')
  public async getAuthorComment () {
    const { ctx, service } = this;

    ctx.body = await service.fileDocument.getAuthorComment();
  }
}
