/*
 * @Author: xzt
 * @Date: 2019-12-16 00:02:58
 * @Last Modified by: xzt
 * @Last Modified time: 2019-12-19 18:35:39
 */
import { Service, Context } from 'egg';
import sequelize from 'sequelize';
import { ResponseWrapper, CodeNum, CodeMsg } from '../../utils/ResponseWrapper';

export default class FolderShell extends Service {
  constructor (ctx: Context) {
    super(ctx);

    this.data = ctx.request.body;
  }

  private data; // 请求数据

  /**
   * 获取分类列表
   * @param userUUID 用户唯一id
   * @param count 每页显示的数量
   * @param page 页标
   */
  async getFolderList () {
    let res = await this.ctx.model.Folder.findAndCountAll({
      raw: true,
      attributes: {
        include: [
          [ sequelize.fn('countFileFromFolder', sequelize.col('folderId')) as any, 'countFile' ],
          [ sequelize.literal('user.userUUID'), 'userUUID' ]
        ],
        exclude: [ 'userId' ]
      },
      include: [{
        model: this.ctx.model.User,
        where: {
          userUUID: this.data.userUUID
        },
        attributes: [ ]
      }],
      order: [
        [ 'createTime', 'DESC' ]
      ],
      limit: this.data.count,
      offset: (this.data.page - 1) * this.data.count
    });

    return ResponseWrapper.mark(CodeNum.SUCCESS, CodeMsg.SUCCESS, res || { }).toString();
  }

  /**
   * 新建分类文件夹
   * @param userId 用户唯一id(token获取)
   * @param folderName 名称
   * @param thumbnailURL 缩略图(可选)
   */
  async createFolder () {
    // 检查参数
    if (!this.data.userId || !this.data.folderName) {
      this.ctx.throw(500, `${CodeMsg.NO_PARAM}: folderName。`);
    }

    let res = await this.ctx.model.Folder.create({
      userId: this.data.userId,
      folderName: this.data.folderName,
      thumbnailURL: this.data.thumbnailURL || null
    } as any);

    return ResponseWrapper.mark(CodeNum.SUCCESS, CodeMsg.SUCCESS, { }).toString();
  }

  /**
   * 修改分类文件夹
   * @param userId 用户唯一id(token获取)
   * @param folderId 文件夹id
   * @param folderName 名称
   * @param thumbnailURL 缩略图(可选)
   */
  async modifyFolder () {
    // 检查参数
    if (!this.data.userId || !this.data.folderId || !this.data.folderName) {
      this.ctx.throw(500, `${CodeMsg.NO_PARAM}: folderId, folderName。`);
    }

    let res = await this.ctx.model.Folder.update({
      folderName: this.data.folderName,
      thumbnailURL: this.data.thumbnailURL || null
    }, {
      where: {
        userId: this.data.userId,
        folderId: this.data.folderId
      }
    });

    return ResponseWrapper.mark(CodeNum.SUCCESS, CodeMsg.SUCCESS, { }).toString();
  }

  /**
   * 获取分类文件夹信息
   * @param userId 用户唯一id(token获取)
   * @param folderId 文件夹id
   */
  async getFolderInfo () {
    // 检查参数
    if (!this.data.userId || !this.data.folderId) {
      this.ctx.throw(500, `${CodeMsg.NO_PARAM}: folderId。`);
    }

    let res = await this.ctx.model.Folder.findOne({
      raw: true,
      attributes: [ 'folderId', 'folderName', 'thumbnailURL' ],
      where: {
        userId: this.data.userId,
        folderId: this.data.folderId
      }
    });

    return ResponseWrapper.mark(CodeNum.SUCCESS, CodeMsg.SUCCESS, res || { }).toString();
  }

  /**
   * 删除单个分类文件夹
   * 因为分类文件夹下有子文章。如果一次删除多个，则存在误删。
   * 如果删除了文件夹，则相应的子文章也都被删除。
   * @param userId 用户唯一id(token获取)
   * @param folderId 文件夹id
   */
  async deleteFolder () {
    // 检查参数
    if (!this.data.userId || !this.data.folderId) {
      this.ctx.throw(500, `${CodeMsg.NO_PARAM}: folderId。`);
    }

    let res = await this.app.sequelize.query(`call deleteFolder(${this.data.userId},${this.data.folderId});`);

    return ResponseWrapper.mark(CodeNum.SUCCESS, CodeMsg.SUCCESS, { }).toString();
  }
}
