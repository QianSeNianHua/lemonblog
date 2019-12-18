import { ISequelizeValidationOnlyConfig } from 'sequelize-typescript';
import { SequelizeConfig } from 'sequelize-typescript/lib/types/SequelizeConfig';
import Sequelize from '@types/sequelize';

declare module 'egg' {
  // extend app
  interface Application {
    Sequelize: Sequelize.Sequelize;
    model: IModel;
  }

  // extend context
  interface Context {
    model: IModel;
  }

  // extend your config 
  interface EggAppConfig {
    sequelize: SequelizeConfig | ISequelizeValidationOnlyConfig;
  }

  interface Instance<T> extends Sequelize.Instance<T>, T { }
  export interface ModelInstance<T> extends Sequelize.Model<Instance, T> { }
}
