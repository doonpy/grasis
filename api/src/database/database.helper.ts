import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

import { isProductionMode, isReviewData } from '../common/common.helper';

export function getDatabaseConfig(): TypeOrmModuleOptions & MysqlConnectionOptions {
  const database = (process.env.JAWSDB_URL?.match(/(?!.*\/)(.*)/) || [])[1];

  return {
    type: 'mysql',
    url: process.env.JAWSDB_URL,
    database: database,
    logging: !isProductionMode() ? ['query', 'error'] : ['query', 'migration'],
    synchronize: !isProductionMode() || isReviewData(),
    autoLoadEntities: true,
    keepConnectionAlive: true,
    timezone: '+00:00',
    charset: 'utf8mb4_unicode_ci'
  };
}
