import { Controller } from 'egg';
import { rd } from '../../lib/routerDecorate/index';

/**
 * 文章列表
 */
@rd.prefix('/file')
export default class File extends Controller {

  /**
   * 获取格式化后的文章列表，只获取已发布的文章
   */
  @rd.post('/getFileList')
  public async getFileList () {
    const { ctx, service } = this;

    ctx.body = await service.fileDocument.getFormatFileList();
  }

  /**
   * 获取格式化后的文章列表，获取已发布和未发布的所有文章
   */
  @rd.post('/getAllFileList', 'verifyToken', 'remoteLogin')
  public async getAllFileList () {
    const { ctx, service } = this;

    ctx.body = await service.fileDocument.getFolderAllFileList();
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
   * 获取文章内容，只获取已发布的文章，供普通用户编辑
   */
  @rd.post('/getArticle')
  public async getArticle () {
    const { ctx, service } = this;

    ctx.body = await service.fileDocument.getArticle();
  }

  /**
   * 获取文章内容，可获取已发布或未发布的文章，供管理者编辑
   */
  @rd.post('/getAllArticle', 'verifyToken', 'remoteLogin')
  public async getAllArticle () {
    const { ctx, service } = this;

    ctx.body = await service.fileDocument.getAllArticle();
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
   * 保存文章
   */
  @rd.post('/saveArticle', 'verifyToken', 'remoteLogin')
  public async saveArticle () {
    const { ctx, service } = this;

    ctx.body = await service.fileDocument.saveArticle();
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
   * 作者发布评论
   */
  @rd.post('/announceComment', 'verifyToken', 'remoteLogin')
  public async announceComment () {
    const { ctx, service } = this;

    ctx.body = await service.fileDocument.announceComment();
  }

  /**
   * 非作者发布评论
   */
  @rd.post('/generalComment')
  public async generalComment () {
    const { ctx, service } = this;

    ctx.body = await service.fileDocument.generalComment();
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
