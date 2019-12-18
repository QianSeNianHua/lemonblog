/*
 * @Author: xzt
 * @Date: 2019-12-18 09:41:52
 * @Last Modified by: xzt
 * @Last Modified time: 2019-12-18 11:30:21
 */
import { Service, Context } from 'egg';
import sequelize from 'sequelize';
import { ResponseWrapper, CodeNum, CodeMsg } from '../../utils/ResponseWrapper';

export default class OpenSourceProject extends Service {
  constructor (ctx: Context) {
    super(ctx);

    this.data = ctx.request.body;
  }

  private data; // 请求数据

  /**
   * 获取开源项目列表
   * @param userUUID 用户uuid
   * @param count 每页显示的数量
   * @param page 页标
   */
  async getOpenSource () {
    let res = await this.ctx.model.Opensource.findAndCountAll({
      raw: true,
      attributes: {
        exclude: [ 'userId' ]
      },
      include: [
        {
          model: this.ctx.model.User,
          where: {
            userUUID: this.data.userUUID
          },
          attributes: [ ]
        }
      ],
      order: [
        [ 'title' ]
      ],
      limit: this.data.count,
      offset: (this.data.page - 1) * this.data.count
    });

    const openIdMap = { };  // { opensourceId: [ tagId ] }
    const tags: any[] = [ ]; // [ tagId ]
    res.rows.forEach(item => {
      const opensourceId = item.opensourceId;

      openIdMap[opensourceId] = item.tagIds.split(',');
      openIdMap[opensourceId].map(id => parseInt(id));

      openIdMap[opensourceId].forEach(id => {
        if (tags.indexOf(id) === -1) {
          tags.push(id);
        }
      });
    });

    let resTags = await this.ctx.model.Tag.findAll({
      raw: true,
      where: {
        tagId: tags
      }
    });

    const tagIdMap = { };  // { tagId: tagName }
    resTags.forEach(item => {
      tagIdMap[item.tagId] = item.tagName;
    });

    // [{ tagId, tagName }]
    Object.keys(openIdMap).forEach(opensourceId => {
      let tagIds = openIdMap[opensourceId];

      openIdMap[opensourceId] = tagIds.map(tagId => {
        return { tagId, tagName: tagIdMap[tagId] };
      });
    });

    res.rows = res.rows.map(item => {
      delete item.tagIds;
      return { ...item, tags: openIdMap[item.opensourceId] };
    });

    return ResponseWrapper.mark(CodeNum.SUCCESS, CodeMsg.SUCCESS, res).toString();
  }
}
