/*
 * @Author: xzt
 * @Date: 2019-12-16 09:49:26
 * @Last Modified by: xzt
 * @Last Modified time: 2020-05-22 13:47:52
 */
import { Service, Context } from 'egg';
import sequelize from 'sequelize';
import { ResponseWrapper, CodeNum, CodeMsg } from '../../utils/ResponseWrapper';
import { UUID4 } from '../../utils/UUID';
import { writeFile, readFileSync, deleteFile } from '../../utils/FileOperation';
import { handleDate } from '../../utils/handleDate';
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
   * 获取格式化后的文章列表，只获取已发布的文章，供普通用户查看
   * @param userUUID 用户uuid
   * @param folderId 分类文件夹id(可选)
   * @param desc 时间排序。true：倒序，false：正序(可选，默认为倒序)
   * @param count 每页显示的数量
   * @param page 页标
   */
  async getFormatFileList () {
    // 校验参数
    this.ctx.validate({
      userUUID: {
        type: 'string',
        required: true
      },
      folderId: {
        type: 'number',
        required: false
      },
      desc: {
        type: 'boolean',
        required: false
      },
      count: 'int',
      page: 'int'
    });

    let res = await this.queryFileList(1, true);

    res = { count: res.count, rows: this.formatFileList(res.rows), page: this.data.page } as any;

    return ResponseWrapper.mark(CodeNum.SUCCESS, CodeMsg.SUCCESS, res).toString();
  }

  /**
   * 获取格式化后的文章列表，获取已发布和未发布的所有文章，供写文章时查看
   * @param userId 用户userId(token获取)
   * @param folderId 分类文件夹id(可选)
   * @param desc 时间排序。true：倒序，false：正序(可选，默认为倒序)
   */
  async getFolderAllFileList () {
    // 校验参数
    this.ctx.validate({
      folderId: {
        type: 'number',
        required: false
      },
      desc: {
        type: 'boolean',
        required: false
      }
    });

    let res = await this.queryFileList(0, false);

    res = { count: res.count, rows: this.formatFileList(res.rows), page: this.data.page } as any;

    return ResponseWrapper.mark(CodeNum.SUCCESS, CodeMsg.SUCCESS, res).toString();
  }

  /**
   * 获取原始的文章列表
   * @param userUUID 用户uuid
   * @param folderId 分类文件夹id(可选)
   * @param desc 时间排序。true：倒序，false：正序(可选，默认为倒序)
   * @param count 每页显示的数量
   * @param page 页标
   */
  async getFileList () {
    let res = await this.queryFileList();

    res = { ...res, page: this.data.page } as any;

    return ResponseWrapper.mark(CodeNum.SUCCESS, CodeMsg.SUCCESS, res).toString();
  }

  /**
   * 对查询到的fileList进行格式化
   * @param rows 文章列表
   * @example
   * rows: [
   *   {
   *     year: '2019',
   *     rows: [
   *       {
   *         month: '12',
   *         rows: []
   *       }
   *     ]
   *   }
   * ]
   */
  private formatFileList (rows: Array<{ createTime: string }>) {
    const map: any[] = [];
    let node;

    rows.forEach(item => {
      let date = new Date(item.createTime);

      let ry = map.some((value, index) => {
        if (value.year === date.getFullYear()) {
          node = map[index];

          return true;
        }
      });
      if (!ry) {
        map.push({ year: date.getFullYear(), rows: [ ] });
        node = map[map.length - 1];
      }

      let rm = node.rows.some((value, index) => {
        if (value.month === (date.getMonth() + 1)) {
          node = node.rows[index];

          return true;
        }
      });
      if (!rm) {
        node.rows.push({ month: date.getMonth() + 1, rows: [ ] });
        node = node.rows[node.rows.length - 1];
      }

      node.rows.push(item);
    });

    return map;
  }

  /**
   * sql获取已发布/所有(包含已发布和未发布)的文章列表
   * all为0，2，需要userUUID。为1，需要userId(token获取)
   * @param {boolean} all 0所有，1已发布，2未发布(默认1)
   * @param {boolean} limit true限制数量，false不限制数量(默认true)
   */
  private async queryFileList (all: number = 1, limit: boolean = true) {
    let desc;
    if (this.data.desc !== false && !this.data.desc) {
      desc = true;
    } else {
      desc = this.data.desc;
    }
    const descin = desc ? [ 'DESC' ] : [];

    let folder: sequelize.IncludeOptions = { };
    if (this.data.folderId) {
      // 获取指定文件夹下的所有文章
      folder = {
        where: {
          folderId: this.data.folderId
        },
        attributes: {
          exclude: [ 'userId', 'folderId' ]
        },
      };
    } else {
      // 获取该用户下的所有文章
      folder = {
        attributes: [ ]
      };
    }

    let where;
    let modelUser: object[] = [];
    if (all === 0) {
      where = {
        userId: this.ctx.middleParams.userId
      };
    } else if (all === 1) {
      where = { isRelease: 1 };
      modelUser.push({
        model: this.ctx.model.User,
        where: {
          userUUID: this.data.userUUID
        },
        attributes: [ ]
      });
    } else if (all === 2) {
      where = {
        isRelease: 2,
        userId: this.ctx.middleParams.userId
      };
    }

    let limitOffset;
    if (limit) {
      limitOffset = {
        limit: this.data.count,
        offset: (this.data.page - 1) * this.data.count
      };
    } else {
      limitOffset = {};
    }

    let res = await this.ctx.model.File.findAndCountAll({
      raw: true,
      attributes: {
        include: [
          [ sequelize.literal('folder.folderName'), 'folderName' ],
          [ sequelize.fn('countComment', sequelize.col('fileId')) as any, 'countComment' ]
        ],
        exclude: [ 'fileId', 'userId', 'contentURL' ]
      },
      include: [
        ...modelUser,
        {
          model: this.ctx.model.Folder,
          ...folder
        }
      ],
      where,
      order: [
        [ 'createTime', ...descin ]
      ],
      ...limitOffset
    });

    return res;
  }

  /**
   * 文章搜索
   */
  async searchFiles () {
    let res;

    return ResponseWrapper.mark(CodeNum.SUCCESS, CodeMsg.SUCCESS, { });
  }

  /**
   * 获取文章内容，只获取已发布的文章，供普通用户编辑
   * @param {string} fileUUID 文章唯一id
   */
  async getArticle () {
    // 校验参数
    this.ctx.validate({
      fileUUID: {
        type: 'string',
        required: true
      }
    });

    let res = await this.ctx.model.File.findOne({
      raw: true,
      attributes: {
        exclude: [ 'fileId', 'folderId', 'userId' ],
        include: [
          [ sequelize.literal('folder.folderName'), 'folderName' ],
          [ sequelize.literal('user.userUUID'), 'userUUID' ]
        ]
      },
      where: {
        fileUUID: this.data.fileUUID,
        isRelease: 1
      },
      include: [
        {
          model: this.ctx.model.Folder,
          attributes: [ ]
        },
        {
          model: this.ctx.model.User,
          attributes: [ ]
        }
      ]
    });

    if (res && res.contentURL) {
      const content = readFileSync(res.contentURL);

      delete res.contentURL;
      res.content = content;
    }

    return ResponseWrapper.mark(CodeNum.SUCCESS, CodeMsg.SUCCESS, res || { }).toString();
  }

  /**
   * 获取文章内容，可获取已发布或未发布的文章，供管理者编辑
   * @param {number} userId 用户id(token获取)
   * @param {string} fileUUID 文章唯一id
   */
  async getAllArticle () {
    // 校验参数
    this.ctx.validate({
      fileUUID: {
        type: 'string',
        required: true
      }
    });

    let res = await this.ctx.model.File.findOne({
      raw: true,
      attributes: [ 'fileUUID', 'contentURL', 'title', 'thumbnailURL' ],
      where: {
        fileUUID: this.data.fileUUID,
        userId: this.ctx.middleParams.userId
      }
    });

    // 获取图片
    if (res && res.thumbnailURL) {
      res.thumbnailURL = `//${this.ctx.host}/${res.thumbnailURL}`;
    }

    // 获取文章内容
    if (res && res.contentURL) {
      const content = readFileSync(res.contentURL);

      delete res.contentURL;
      res.content = content;
    } else {
      delete res.contentURL;
      res.content = '';
    }

    return ResponseWrapper.mark(CodeNum.SUCCESS, CodeMsg.SUCCESS, res || { }).toString();
  }

  /**
   * 获取全部评论
   * @param fileUUID 文章唯一id
   * @param desc 时间排序。true：倒序，false：正序(可选，默认为true)
   * @param count 每页显示的数量
   * @param page 页标
   */
  async getComment () {
    let desc;
    if (this.data.desc !== false && !this.data.desc) {
      desc = true;
    } else {
      desc = this.data.desc;
    }
    const descin = desc ? [ 'DESC' ] : [];

    // 获取评论总数
    let resCount = await this.ctx.model.File.findOne({
      raw: true,
      attributes: {
        include: [
          [ sequelize.fn('countComment', sequelize.col('fileId')) as any, 'countComment' ]
        ],
        exclude: [ 'fileId', 'fileUUID', 'title', 'createTime', 'visit', 'contentURL', 'folderId', 'userId' ]
      },
      where: {
        fileUUID: this.data.fileUUID,
        isRelease: 1
      }
    });

    // 第一层评论
    let resFather = await this.ctx.model.Comment.findAndCountAll({
      raw: true,
      attributes: {
        exclude: [ 'fileId' ]
      },
      where: {
        level: 1
      },
      include: [
        {
          model: this.ctx.model.File,
          where: {
            fileUUID: this.data.fileUUID,
            isRelease: 1
          },
          attributes: [ ]
        },
        {
          model: this.ctx.model.User,
          attributes: [ 'nickname', 'portraitURL' ]
        }
      ],
      order: [
        [ 'createTime', ...descin ]
      ],
      limit: this.data.count,
      offset: (this.data.page - 1) * this.data.count
    });

    const ids: any[] = [ ];
    resFather.rows.forEach(item => {
      ids.push(item.commentId);
    });

    // 第二层评论
    let resChild = await this.ctx.model.Comment.findAll({
      raw: true,
      attributes: {
        exclude: [ 'fileId' ]
      },
      where: {
        level: 2,
        fatherCommentId: ids
      },
      include: [
        {
          model: this.ctx.model.File,
          where: {
            fileUUID: this.data.fileUUID,
            isRelease: 1
          },
          attributes: [ ]
        },
        {
          model: this.ctx.model.User,
          attributes: [ 'nickname', 'portraitURL' ]
        }
      ],
      order: [
        [ 'createTime', ...descin ]
      ]
    });

    const res = this.commentDataTrans(resFather.rows, resChild);

    return ResponseWrapper.mark(CodeNum.SUCCESS, CodeMsg.SUCCESS, { count: resCount.countComment, rows: res }).toString();
  }

  /**
   * 获取作者的评论
   * @param fileUUID 文章唯一id
   * @param desc 时间排序。true：倒序，false：正序(可选，默认为true)
   */
  async getAuthorComment () {
    let desc;
    if (this.data.desc !== false && !this.data.desc) {
      desc = true;
    } else {
      desc = this.data.desc;
    }
    const descin = desc ? [ 'DESC' ] : [];

    // 第二层评论
    let resComm = await this.ctx.model.Comment.findAll({
      raw: true,
      attributes: {
        exclude: [ 'fileId' ]
      },
      where: {
        userId: {
          [sequelize.Op.ne as any]: -1
        }
      },
      include: [
        {
          model: this.ctx.model.File,
          where: {
            fileUUID: this.data.fileUUID,
            isRelease: 1
          },
          attributes: [ ]
        },
        {
          model: this.ctx.model.User,
          attributes: [ 'nickname', 'portraitURL' ]
        }
      ],
      order: [
        [ 'createTime', ...descin ]
      ]
    });

    const ids: any[] = [ ];
    // 第二层评论
    const resChild = resComm.filter(item => {
      if (item.level === 2) {
        ids.push(item.fatherCommentId);

        return true;
      } else if (item.level === 1) {
        ids.push(item.commentId);
      }
    });

    // 第一层评论
    let resFather = await this.ctx.model.Comment.findAll({
      raw: true,
      attributes: {
        exclude: [ 'fileId' ]
      },
      where: {
        level: 1,
        commentId: ids
      },
      include: [
        {
          model: this.ctx.model.File,
          where: {
            fileUUID: this.data.fileUUID,
            isRelease: 1
          },
          attributes: [ ]
        },
        {
          model: this.ctx.model.User,
          attributes: [ 'nickname', 'portraitURL' ]
        }
      ],
      order: [
        [ 'createTime', ...descin ]
      ]
    });

    const res = this.commentDataTrans(resFather, resChild);

    return ResponseWrapper.mark(CodeNum.SUCCESS, CodeMsg.SUCCESS, { count: resFather.length + resChild.length, rows: res }).toString();
  }

  /**
   * 评论数据转换
   */
  private commentDataTrans (resFather: any[], resChild: any[]) {
    const data: any[] = [];
    resChild.map(item => {
      // 清除userId
      // userAll表示该评论为作者发表的，true表示是，false表示不是
      if (item.userId === -1) {
        item.userAll = false;
      } else {
        item.userAll = true;
        item.nickname = item['user.nickname'];
        item.portraitURL = item['user.portraitURL'];
      }

      delete item.userId;
      delete item['user.nickname'];
      delete item['user.portraitURL'];

      return item;
    });

    resFather.forEach(father => {
      const dataT: any[] = [];

      // 清除userId
      // userAll表示该评论为作者发表的，true表示是，false表示不是
      if (father.userId === -1) {
        father.userAll = false;
      } else {
        father.userAll = true;
        father.nickname = father['user.nickname'];
        father.portraitURL = father['user.portraitURL'];
      }

      delete father.userId;
      delete father['user.nickname'];
      delete father['user.portraitURL'];

      resChild.forEach(child => {
        if (father.commentId === child.fatherCommentId) {
          dataT.push(child);
        }
      });

      data.push({ ...father, child: dataT });
    });

    return data;
  }

  /**
   * 新建文章
   * @param {number} userId 用户id(token获取)
   * @param {number} folderId 文件夹id
   */
  async createAritcle () {
    // 检查参数
    this.ctx.validate({
      folderId: {
        type: 'number',
        required: true
      }
    });

    let time = handleDate(new Date().getTime());
    // const fileName = time.year + time.month + time.date + UUID4(6) + '.txt';

    // try {
    //   // 写入文件成功
    //   await writeFile(fileName, this.data.content);
    // } catch (error) {
    //   this.ctx.throw(500, '创建文件失败');
    // }

    const title = `${time.year}-${time.month}-${time.date}`;

    await this.ctx.model.File.create({
      title,
      createTime: new Date(),
      folderId: this.data.folderId,
      userId: this.ctx.middleParams.userId,
      fileUUID: UUID4(12),
      isRelease: 0
    } as any);

    return ResponseWrapper.mark(CodeNum.SUCCESS, CodeMsg.SUCCESS, { }).toString();
  }

  /**
   * 保存文章
   * @param {number} userId 用户id(token获取)
   * @param {string} fileUUID 文章id
   * @param {file} file 图片文件
   * @param {string} title 文章标题
   * @param {string} content 文章内容
   */
  async saveArticle () {
    const userId = this.ctx.middleParams.userId;

    const baseDirname = 'files/private';
    // 获取formData数据，保存图片
    let res: any = await multipleFile(this.ctx, (stream, fileName) => {
      const writeStream = fs.createWriteStream(path.resolve(baseDirname, 'doc', fileName));
      stream.pipe(writeStream);
    });

    // 获取文章文件地址和图片地址
    let que = await this.ctx.model.File.findOne({
      raw: true,
      where: {
        userId,
        fileUUID: res.obj.fileUUID
      }
    });

    if (que) {
      // 判断文章文件地址
      if (que.contentURL) {

      }
    }
  }

  /**
   * 修改文章
   * @param {string} fileUUID 文章id
   * @param {string} title 文章标题
   * @param {string} content 文章内容
   */
  async modifyArticle () {
    // 检查参数
    this.ctx.validate({
      fileUUID: {
        type: 'string',
        required: true
      },
      title: {
        type: 'string',
        required: false
      },
      content: {
        type: 'string',
        required: false
      }
    });

    const fileUUID = this.data.fileUUID;
    const res = await this.getFileInfo(fileUUID);

    if (res) {
      const title = this.data.title;
      const content = this.data.content;

      // 更新标题
      if (title) {
        await this.ctx.model.File.update({
          title
        }, {
          where: {
            fileUUID
          }
        });
      }

      // 异步更新文件内容
      if (content) {
        writeFile(res.fileName, content, err => {
          if (err) {
            this.ctx.throw(500, '写入文件失败');
          }
        });
      }
    }

    return ResponseWrapper.mark(CodeNum.SUCCESS, CodeMsg.SUCCESS, { }).toString();
  }

  /**
   * 删除单篇文章
   * @param {string} fileUUID 文章id
   */
  async deleteArticle () {
    // 检查参数
    this.ctx.validate({
      fileUUID: {
        type: 'string',
        required: true
      }
    });

    const fileUUID = this.data.fileUUID;
    const res = await this.getFileInfo(fileUUID);

    if (res) {
      // 删除文件
      try {
        await deleteFile(res.fileName);
      // tslint:disable-next-line: no-empty
      } catch (error) {
      }
    }

    // 删除文章
    await this.ctx.model.File.destroy({
      where: {
        fileUUID
      }
    });

    return ResponseWrapper.mark(CodeNum.SUCCESS, CodeMsg.SUCCESS, { }).toString();
  }

  /**
   * 根据fileUUID获取contentURL
   * @param {string} fileUUID 文章id
   */
  private async getFileInfo (fileUUID) {
    let res = await this.ctx.model.File.findOne({
      raw: true,
      attributes: [ 'contentURL', 'fileId', 'userId' ],
      where: {
        fileUUID
      }
    });

    return res ? { fileName: res.contentURL, fileId: res.fileId, userId: res.userId } : null;
  }

  // userId，作者发布，值为非-1。非作者发布，值为-1
  // nickname，portraitURL，非作者发布，则需要提供用户的昵称和头像(后端随机给)
  // level，fatherCommentId，第一层评论，level为1，fatherCommentId为null。第二层评论，level为2，fatherCommentId指向第一层评论的commentId
  // appointCommentId，如果是@某人，则指向评论的commentId。否则为null
  // content，评论内容
  /**
   * 作者发布评论
   * @param {string} fileUUID 文章唯一id
   * @param {number} userId 作者id（token获取）。当评论者为作者时，则为该用户的id。当评论者为非作者时，则为-1。
   * @param {number} level 层级，1和2
   * @param {number} fatherCommentId 回复的第一层id。当level为1时，此参数为null；当level为2时，此参数不为空
   * @param {number} appointCommentId 回复的指定用户
   * @param {string} content 评论内容
   */
  async announceComment () {
    // 检查参数
    this.ctx.validate({
      fileUUID: 'string',
      level: 'number',
      fatherCommentId: {
        type: 'number',
        required: false
      },
      appointCommentId: {
        type: 'number',
        required: false
      },
      content: 'string'
    });

    const res = await this.getFileInfo(this.data.fileUUID);

    if (!res) {
      // fileUUID错误
      return ResponseWrapper.mark(CodeNum.ERROR, 'fileUUID参数错误', { }).toString();
    }

    const level = this.data.level;
    const fatherCommentId = level === 1 ? null : this.data.fatherCommentId;

    await this.ctx.model.Comment.create({
      userId: this.ctx.middleParams.userId,
      createTime: new Date(),
      level,
      fatherCommentId,
      appointCommentId: this.data.appointCommentId,
      content: this.data.content,
      fileId: res.fileId
    } as any);

    return ResponseWrapper.mark(CodeNum.SUCCESS, CodeMsg.SUCCESS, { }).toString();
  }

  /**
   * 非作者发布评论
   * @param {number} fileUUID 文章唯一id
   * @param {string} nickname 昵称
   * @param {number} level 层级，1和2
   * @param {number} fatherCommentId 回复的第一层id。当level为1时，此参数为null；当level为2时，此参数不为空
   * @param {number} appointCommentId 回复的指定用户
   * @param {string} content 评论内容
   */
  async generalComment () {
    // 检查参数
    this.ctx.validate({
      fileUUID: 'string',
      nickname: 'string',
      level: 'number',
      fatherCommentId: {
        type: 'number',
        required: false
      },
      appointCommentId: {
        type: 'number',
        required: false
      },
      content: 'string'
    });

    const res = await this.getFileInfo(this.data.fileUUID);

    if (!res) {
      // fileUUID错误
      return ResponseWrapper.mark(CodeNum.ERROR, 'fileUUID参数错误', { }).toString();
    }

    const level = this.data.level;
    const fatherCommentId = level === 1 ? null : this.data.fatherCommentId;

    await this.ctx.model.Comment.create({
      userId: -1,
      createTime: new Date(),
      nickname: this.data.nickname,
      portraitURL: null,
      level,
      fatherCommentId,
      appointCommentId: this.data.appointCommentId,
      content: this.data.content,
      fileId: res.fileId
    } as any);

    return ResponseWrapper.mark(CodeNum.SUCCESS, CodeMsg.SUCCESS, { }).toString();
  }

  /**
   * 删除评论
   * @param commentId 评论id
   * @param fileUUID 文章id
   */
  async deleteComment () {
    // 检查参数
    this.ctx.validate({
      commentId: 'number',
      fileUUID: 'string'
    });

    // 判断fileUUID是否是自己的文章
    const userId = this.ctx.middleParams.userId;
    let res = await this.getFileInfo(this.data.fileUUID);

    if (!res || res.userId !== userId) {
      // 文章id不是作者的文章
      return ResponseWrapper.mark(CodeNum.ERROR, 'fileUUID参数错误', { }).toString();
    }

    await this.ctx.model.Comment.destroy({
      where: {
        commentId: this.data.commentId,
        fileId: res.fileId
      }
    });

    return ResponseWrapper.mark(CodeNum.SUCCESS, CodeMsg.SUCCESS, { }).toString();
  }
}

// userId映射到userUUID，防止前端通过userId直接访问到所有用户
// 要是没登录，传递userUUID
// 要是已登录，传递token判断是否过期，获取token里的userUUID
