import { Model, AutoIncrement, Column, PrimaryKey, Table, Validate, CreatedAt, UpdatedAt, DataType, Unique, AllowNull, Default, HasMany } from 'sequelize-typescript';
import { ModelAttributeColumnOptions, col } from 'sequelize/types';
import * as uuid from 'uuid/v4';
import OpenSouce from './opensource';
import Folder from './folder';
import File from './file';

@Table({
  modelName: 'user'
})
export default class User extends Model<User> {
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    comment: '用户id'
  } as ModelAttributeColumnOptions)
  userId: number;

  @Default(uuid())
  @AllowNull(false)
  @Column({
    type: DataType.STRING(45),
    comment: '用户唯一id'
  })
  userUUID: string;

  @Default(new Date())
  @Column({
    type: DataType.DATE(3),
    comment: '创建时间'
  })
  createTime: Date;

  @Validate({
    length (value: string) {
      if (value.length > 12) {
        throw new Error('nickname长度不能超过12。');
      }
    }
  })
  @Column({
    type: DataType.STRING(12),
    comment: '昵称'
  })
  nickname: string;

  @Validate({
    length (value: string) {
      if (value.length > 40) {
        throw new Error('briefIntro长度不能超过40。');
      }
    }
  })
  @Column({
    type: DataType.STRING(40),
    comment: '个性签名'
  })
  briefIntro: string;

  @Column({
    type: DataType.STRING(50),
    comment: '头像'
  })
  portraitURL: string;

  @Validate({
    isNumeric: true,
    len: [ 7, 11 ]
  })
  @Column({
    type: DataType.STRING(20),
    comment: '账号'
  })
  account: string;

  @Column({
    type: DataType.STRING(100),
    comment: '密码'
  })
  password: string;

  @Column({
    type: DataType.STRING(255),
    comment: '其他登录方式：微信、QQ、微博'
  })
  otherLogin: string;

  @HasMany(() => OpenSouce)
  hmOpenSources: OpenSouce[];

  @HasMany(() => Folder)
  hmFolders: Folder[];

  @HasMany(() => File)
  hmFiles: File[];
}
