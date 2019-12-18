import { Controller } from 'egg';
import { rd } from '../../lib/routerDecorate/index';

/**
 * 文章列表
 */
@rd.prefix('/file')
export default class File extends Controller {

  @rd.post('/getFileList')
  public async getFileList () {
    const { ctx, service } = this;

    ctx.body = await service.fileDocument.getFormatFileList();
  }

  @rd.post('/searchFiles')
  public async searchFiles () {
    const { ctx, service } = this;

    ctx.body = await service.fileDocument.searchFiles();
  }

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
