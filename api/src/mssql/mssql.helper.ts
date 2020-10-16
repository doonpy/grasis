import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { ConnectionOptions, createConnection } from 'typeorm';

import { isProductionMode } from '../common/common.helper';
import { DatabaseType } from '../common/common.resource';
import devOrmConfigs from '../orm-configs/dev';
import localOrmConfigs from '../orm-configs/local';
import prodOrmConfigs from '../orm-configs/prod';

export function getDatabaseConfig(): TypeOrmModuleOptions & ConnectionOptions {
  let configs: ConnectionOptions & TypeOrmModuleOptions;
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
    keepConnectionAlive: true
  };
}

export async function runMigrations(): Promise<void> {
  const connection = await createConnection(getDatabaseConfig());
  await connection.runMigrations();
}
