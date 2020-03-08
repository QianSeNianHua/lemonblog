import { EggPlugin } from 'egg';
import * as path from 'path';

const plugin: EggPlugin = {
  // static: true,
  // nunjucks: {
  //   enable: true,
  //   package: 'egg-view-nunjucks',
  // },

  // 数据库
  sequelize: {
    enable: true,
    path: path.resolve(__dirname, '../lib/egg-sequelize-ts')
  },

  // 跨域白名单
  cors: {
    enable: true,
    package: 'egg-cors'
  },

  // redis
  redis: {
    enable: true,
    package: 'egg-redis'
  },

  // request参数校验
  // validator
  validate: {
    enable: true,
    path: path.resolve(__dirname, '../lib/egg-validate')
  }
};

export default plugin;
