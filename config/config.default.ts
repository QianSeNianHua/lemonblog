import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import * as path from 'path';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1574394479290_3779';

  // 抛出错误，并返回格式化的错误信息
  config.middleware = [ 'jsonError' ];
  config.jsonError = {
    postFormat: (_e, { stack, ...rest }) => appInfo.env === 'prod' ? { code: rest.status, msg: rest.message || '', data: {} } : { code: rest.status, msg: rest.message || '', stack: stack || '', data: {} }
  };

  // 解析 application/json, text/plain
  config.bodyParser = {
    enable: true,
    enableTypes: [ 'json', 'form', 'text' ]
  };

  // 解析 multipart/form-data
  config.multipart = {
    mode: 'file',
    // fieldNameSize: 100, // 非文件字段键最大100字节
    // fieldSize: '10kb', // 非文件字段值最大100kb
    // fields: 10, // 非文件字段数量最大10个
    // fileSize: '10mb', // 文件最大10mb
    // files: 10, // 文件数量最大10个
    // fileExtensions: ['.apk'], // 扩展文件格式
    // whitelist: ['.png'], // 只支持.png格式
  };

  // mariadb
  config.sequelize = {
    dialect: 'mariadb',
    database: 'lemonblog',
    define: {
      timestamps: false,  // 时间戳，会给表名加上s
      paranoid: true,
      underscored: false, // 下划线，会给字段加上_
      freezeTableName: true,
    },
    timezone: '+08:00'
  };

  // 接口报错
  // config.onerror = {
  //   errorPageUrl: '/public/404.html'
  // };

  // 页面找不到
  config.notfound = {
    pageUrl: '/404.html'
  };

  // 静态页面路径
  config.static = {
    prefix: '/',
    dir: path.join(appInfo.baseDir, 'app/public')
  };

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
