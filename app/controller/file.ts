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

  /**
   * 获取评论内容
   */
  @rd.post('/getComment')
  public async getComment () {
    const { ctx, service } = this;

    ctx.body = await service.fileDocument.getComment();
  }

  /**
   * 只获取作者评论内容
   */
  @rd.post('/getAuthorComment')
  public async getAuthorComment () {
    const { ctx, service } = this;

    ctx.body = await service.fileDocument.getAuthorComment();
  }

  /**
   * 新建文章
   */
  @rd.post('/createArticle', 'verifyToken', 'remoteLogin')
  public async createArticle () {
    const { ctx, service } = this;

    ctx.body = await service.fileDocument.createAritcle();
  }

  /**
   * 删除文章
   */
  @rd.post('/deleteArticle', 'verifyToken', 'remoteLogin')
  public async deleteArticle () {
    const { ctx, service } = this;

    ctx.body = await service.fileDocument.deleteArticle();
  }

  /**
   * 修改文章
   */
  @rd.post('/modifyArticle', 'verifyToken', 'remoteLogin')
  public async modifyArticle () {
    const { ctx, service } = this;

    ctx.body = await service.fileDocument.modifyArticle();
  }

  /**
   * 发表评论
   */
  @rd.post('/announceComment', 'verifyToken', 'remoteLogin')
  public async announceComment () {
    const { ctx, service } = this;

    ctx.body = await service.fileDocument.announceComment();
  }

  /**
   * 删除评论
   */
  @rd.post('/deleteComment', 'verifyToken', 'remoteLogin')
  public async deleteComment () {
    const { ctx, service } = this;

    ctx.body = await service.fileDocument.deleteComment();
  }
}
