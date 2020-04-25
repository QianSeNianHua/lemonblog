import { AutoIncrement, Column, Model, PrimaryKey, Table, CreatedAt, UpdatedAt, DataType, Unique, AllowNull, ForeignKey, BelongsTo, HasOne, HasMany, BelongsToMany, Default } from 'sequelize-typescript';
import User from './user';
import Folder from './folder';
import Comment from './comment';

@Table({
  modelName: 'file'
})
export default class File extends Model<File> {
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    comment: '文章id'
  })
  fileId: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(45),
    comment: '文章唯一id'
  })
  fileUUID: string;

  @Column({
    type: DataType.STRING(50),
    comment: '文章标题'
  })
  title: string;

  @Column({
    type: DataType.DATE(6),
    comment: '创建时间'
  })
  createTime: Date;

  @Column({
    type: DataType.INTEGER,
    comment: '访客量'
  })
  visit: number;

  @Column({
    type: DataType.STRING(100),
    comment: '文章内容'
  })
  contentURL: string;

  @ForeignKey(() => Folder)
  @Column({
    type: DataType.INTEGER,
    comment: '分类文件夹的id'
  })
  folderId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    comment: '用户id'
  })
  userId: number;

  @BelongsTo(() => Folder, 'folderId')
  folder: Folder;

  @BelongsTo(() => User, 'userId')
  user: User;

  @HasMany(() => Comment)
  hmComments: Comment[];
}
