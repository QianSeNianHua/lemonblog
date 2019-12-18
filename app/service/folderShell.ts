/*
 * @Author: xzt
 * @Date: 2019-12-16 00:02:58
 * @Last Modified by: xzt
 * @Last Modified time: 2019-12-18 09:39:00
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
   * @param userUUID 用户uuid
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
}
