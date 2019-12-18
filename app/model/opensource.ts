import { AutoIncrement, Column, Model, PrimaryKey, Table, DataType, Unique, AllowNull, ForeignKey, BelongsTo, HasOne, HasMany, BelongsToMany } from 'sequelize-typescript';
import User from './user';

@Table({
  modelName: 'opensource'
})
export default class OpenSource extends Model<OpenSource> {
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    comment: 'id'
  })
  opensourceId: number;

  @Column({
    type: DataType.STRING(50),
    comment: '标题'
  })
  title: string;

  @Column({
    type: DataType.STRING(512),
    comment: '介绍'
  })
  introduction: string;

  @Column({
    type: DataType.STRING(512),
    comment: '标签id'
  })
  tagIds: string;

  @Column({
    type: DataType.STRING(50),
    comment: '缩略图'
  })
  thumbnailURL: string;

  @Column({
    type: DataType.STRING(100),
    comment: '链接地址'
  })
  href: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    comment: '用户id'
  })
  userId: number;

  @BelongsTo(() => User, 'userId')
  user: User;
}
