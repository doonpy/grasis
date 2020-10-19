import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { ConnectionOptions } from 'typeorm';

import { isProductionMode } from '../common/common.helper';
import { DatabaseType } from '../common/common.resource';
import devOrmConfigs from '../orm-configs/dev.json';
import localOrmConfigs from '../orm-configs/local.json';
import prodOrmConfigs from '../orm-configs/prod.json';

export function getDatabaseConfig(): TypeOrmModuleOptions & ConnectionOptions {
  let configs: any;
  switch (process.env.DB_TYPE) {
    case DatabaseType.STAGING:
      configs = devOrmConfigs;
      break;
    case DatabaseType.PRODUCTION:
      configs = prodOrmConfigs;
      break;
    default:
      configs = localOrmConfigs;
      break;
  }

  return {
    ...configs,
    logging: !isProductionMode(),
    synchronize: !isProductionMode(),
    autoLoadEntities: true,
    keepConnectionAlive: true,
    options: {
      useUTC: true
    }
  };
}
