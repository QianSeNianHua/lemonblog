import { EggPlugin } from 'egg';
import * as path from 'path';

const plugin: EggPlugin = {
  // static: true,
  // nunjucks: {
  //   enable: true,
  //   package: 'egg-view-nunjucks',
  // },

  // sql
  sequelize: {
    enable: true,
    path: path.resolve(__dirname, '../lib/egg-sequelize-ts')
  },

  // 跨域
  cors: {
    enable: true,
    package: 'egg-cors'
  }
};

export default plugin;
