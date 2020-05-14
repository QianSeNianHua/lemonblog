import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};

  config.security = {
    // 安全防范
    csrf: {
      enable: false,
    },
  };

  // 跨域白名单
  config.cors = {
    origin: 'http://127.0.0.1:7002',
    credentials: true,
    allowMethods: 'GET,POST'
  };

  // mariadb
  config.sequelize = {
    host: '192.168.56.102',
    port: 3306,
    username: 'root',
    password: 'root'
  };

  // redis
  config.redis = {
    client: {
      port: 6379,
      host: '192.168.56.102',
      password: 'root',
      db: 1
    }
  };

  return config;
};
