/*
 * @Author: xzt
 * @Date: 2019-12-16 00:02:58
 * @Last Modified by: xzt
 * @Last Modified time: 2020-05-22 13:47:19
 */
import { Service, Context } from 'egg';
import sequelize from 'sequelize';
import { ResponseWrapper, CodeNum, CodeMsg } from '../../utils/ResponseWrapper';
import * as path from 'path';
import * as fs from 'fs';
import { multipleFile } from '../../utils/formData';

export default class FolderShell extends Service {
  constructor (ctx: Context) {
    super(ctx);

    this.data = ctx.request.body;
  }

  private data; // 请求数据

  /**
   * 获取分类列表
   * @param userUUID 用户唯一id
   */
  async getFolderList () {
    // 检查参数
    this.ctx.validate({
      userUUID: {
        type: 'string',
        required: true
      }
    });

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
      ]
    });

    res.rows.map(item => {
      item.thumbnailURL = `//${this.ctx.host}/${item.thumbnailURL}`;
    });

    return ResponseWrapper.mark(CodeNum.SUCCESS, CodeMsg.SUCCESS, res || { }).toString();
  }

  /**
   * 新建分类文件夹，修改分类文件夹
   * 新建时，需要folderName，file
   * 修改时，需要folderId，folderName或folderId，folderName，file
   * @param userId 用户唯一id(token获取)
   * @param folderId 文件夹id(可选)。有值，表示修改。无值，表示新建
   * @param folderName 名称
   * @param file 图片文件(可选)
   */
  async createFolder () {
    const userId = this.ctx.middleParams.userId;
    const userUUID = this.ctx.middleParams.userUUID;

    // 文件不存在则创建
    const baseDirname = 'files/public';
    const dirname = `${userUUID}/image`;
    this.mkdirsSync(path.join(baseDirname, dirname));
    // 获取formData数据，保存图片
    let res: any = await multipleFile(this.ctx, (stream, fileName) => {
      const writeStream = fs.createWriteStream(path.resolve(baseDirname, dirname, fileName));
      stream.pipe(writeStream);
    });

    // 不存在folderId，则新建。存在folderId，则修改
    if (!res.obj.folderId) {
      await this.ctx.model.Folder.create({
        folderName: res.obj.folderName || null,
        createTime: new Date(),
        userId,
        thumbnailURL: res.files[0] ? path.join(dirname, res.files[0]) : null
      } as any);
    } else {
      if (!res.files[0]) {
        // 不修改图片，只修改文件夹名称
        await this.ctx.model.Folder.update({
          folderName: res.obj.folderName
        }, {
          where: {
            userId,
            folderId: res.obj.folderId
          }
        });
      } else {
        // 修改图片，和修改文件夹名称
        let que = await this.ctx.model.Folder.findOne({
          raw: true,
          where: {
            userId,
            folderId: res.obj.folderId
          }
        });

        if (que) {
          // 删除原来的图片
          if (que.thumbnailURL) {
            this.delFileSync(que.thumbnailURL);
          }

          await this.ctx.model.Folder.update({
            folderName: res.obj.folderName,
            thumbnailURL: res.files[0] ? path.join(dirname, res.files[0]) : undefined
          }, {
            where: {
              userId,
              folderId: res.obj.folderId
            }
          });
        }
      }
    }

    return ResponseWrapper.mark(CodeNum.SUCCESS, CodeMsg.SUCCESS, { }).toString();
  }

  /**
   * 文件夹不存在时，则创建
   * @param {string} dirname 文件路径
   */
  private mkdirsSync (dirname) {
    if (fs.existsSync(dirname)) {
      return true;
    } else {
      if (this.mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);

        return true;
      }
    }
  }

  /**
   * 删除文件
   */
  private delFileSync (dirname) {
    const baseDirname = 'files/public';
    const route = path.resolve(baseDirname, dirname);

    try {
      if (fs.existsSync(route)) {
        fs.unlinkSync(route);
      }
    } catch (error) {
    }
  }

  /**
   * 暂时不知道干嘛用
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
   * @param {number} userId 用户唯一id(token获取)
   * @param {number} folderId 文件夹id
   */
  async deleteFolder () {
    // 检查参数
    this.ctx.validate({
      folderId: {
        type: 'number',
        required: true
      }
    });

    const userId = this.ctx.middleParams.userId;
    const folderId = this.data.folderId;

    let req = await this.ctx.model.Folder.findOne({
      raw: true,
      where: {
        userId,
        folderId
      }
    });

    if (req) {
      // 删除folder的图片
      if (req.thumbnailURL) {
        this.delFileSync(req.thumbnailURL);
      }
    }

    await this.app.sequelize.query(`call deleteFolder(${userId},${folderId});`);

    return ResponseWrapper.mark(CodeNum.SUCCESS, CodeMsg.SUCCESS, { }).toString();
  }
}
