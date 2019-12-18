import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};

  config.security = {
    // 安全防范
    csrf: {
      enable: false,
    },
  };

  return config;
};
