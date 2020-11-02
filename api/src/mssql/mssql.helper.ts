import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

import { isProductionMode } from '../common/common.helper';
import { DatabaseType } from '../common/common.resource';
import devOrmConfigs from '../orm-configs/dev.json';
import localOrmConfigsA from '../orm-configs/local';
import localOrmConfigs from '../orm-configs/local.json';
import prodOrmConfigs from '../orm-configs/prod.json';

export function getDatabaseConfig(): TypeOrmModuleOptions & MysqlConnectionOptions {
  let configs: MysqlConnectionOptions;
  switch (process.env.DB_TYPE) {
    // case DatabaseType.STAGING:
    //   configs = devOrmConfigs;
    //   break;
    // case DatabaseType.PRODUCTION:
    //   configs = prodOrmConfigs;
    //   break;
    default:
      configs = localOrmConfigsA;
      break;
  }

  return {
    ...configs,
    logging: !isProductionMode() ? ['query', 'error'] : ['migration'],
    synchronize: !isProductionMode(),
    autoLoadEntities: true,
    keepConnectionAlive: true,
    timezone: 'UTC',
    charset: 'utf8mb4_unicode_ci'
  };
}
