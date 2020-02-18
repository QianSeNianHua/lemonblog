import { AutoIncrement, Column, Model, PrimaryKey, ForeignKey, Table, CreatedAt, UpdatedAt, DataType, Unique, AllowNull, BelongsTo } from 'sequelize-typescript';
import File from './file';
import User from './user';

@Table({
  modelName: 'comment'
})
export default class Comment extends Model<Comment> {
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    comment: '评论id'
  })
  commentId: number;

  @Column({
    type: DataType.DATE(6),
    comment: '创建时间'
  })
  createTime: Date;

  @Column({
    type: DataType.STRING(20),
    comment: '评论者的昵称'
  })
  nickname: string;

  @Column({
    type: DataType.STRING(50),
    comment: '头像'
  })
  portraitURL: string;

  @Column({
    type: DataType.INTEGER,
    comment: '1表示第一层评论，2表示第二层评论'
  })
  level: number;

  @Column({
    type: DataType.INTEGER,
    comment: '这个是子评论，它的父评论的评论id'
  })
  fatherCommentId: number;

  @Column({
    type: DataType.INTEGER,
    comment: '@某人的评论id'
  })
  appointCommentId: number;

  @Column({
    type: DataType.STRING(512),
    comment: '评论内容'
  })
  content: string;

  @ForeignKey(() => File)
  @Column({
    type: DataType.INTEGER,
    comment: '被评论的文章id'
  })
  fileId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    comment: '评论者的用户id'
  })
  userId: number;

  @BelongsTo(() => File, 'fileId')
  file: File;

  @BelongsTo(() => User, 'userId')
  user: User;
}
