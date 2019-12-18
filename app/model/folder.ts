import { AutoIncrement, Column, Model, PrimaryKey, Table, CreatedAt, UpdatedAt, DataType, Unique, AllowNull, ForeignKey, BelongsTo, HasOne, HasMany, BelongsToMany } from 'sequelize-typescript';
import User from './user';
import File from './file';

@Table({
  modelName: 'folder'
})
export default class Folder extends Model<Folder> {
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    comment: '文件夹id'
  })
  folderId: number;

  @Column({
    type: DataType.STRING(30),
    comment: '文件夹名称'
  })
  folderName: string;

  @Column({
    type: DataType.DATE(6),
    comment: '创建时间'
  })
  createTime: Date;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    comment: '用户id'
  })
  userId: number;

  @Column({
    type: DataType.STRING(50),
    comment: '缩略图'
  })
  thumbnailURL: string;

  @BelongsTo(() => User, 'userId')
  user: User;

  @HasMany(() => File)
  hmFiles: File[];
}
