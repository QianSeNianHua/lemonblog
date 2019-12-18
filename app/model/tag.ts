import { AutoIncrement, Column, Model, PrimaryKey, Table, CreatedAt, UpdatedAt, DataType, Unique, AllowNull } from 'sequelize-typescript';

@Table({
  modelName: 'tag'
})
export default class Tag extends Model<Tag> {
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    comment: '标签id'
  })
  tagId: number;

  @Column({
    type: DataType.STRING(20),
    comment: '标签名'
  })
  tagName: string;
}
