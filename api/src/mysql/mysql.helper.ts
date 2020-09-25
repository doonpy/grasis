import { SequelizeModuleOptions } from '@nestjs/sequelize';
import chalk from 'chalk';
import { isProductionMode } from '../common/common.helper';
import { Student } from '../student/student.model';
import { User } from '../user/user.model';

export function getDatabaseConfig(
  includeDatabase: boolean,
): SequelizeModuleOptions {
  const configs: SequelizeModuleOptions = {
    dialect: 'mysql',
    models: [User, Student],
    host: process.env.DB_MYSQL_HOST,
    port: parseInt(process.env.DB_MYSQL_PORT || '3000'),
    username: process.env.DB_MYSQL_USERNAME,
    password: process.env.DB_MYSQL_PASSWORD,
    logging:
      !isProductionMode() &&
      function (log: string, timing?: number): void {
        console.log(
          `${chalk.cyan(`[MySQL] ${process.pid}`)}  - ${chalk.blue(
            log,
          )} ${chalk.red(`+${timing}ms`)}`,
        );
      },
    benchmark: !isProductionMode(),
    logQueryParameters: !isProductionMode(),
    autoLoadModels: true,
    sync: { alter: !isProductionMode(), force: isProductionMode() },
    timezone: process.env.DB_MYSQL_TIMEZONE,
  };

  if (includeDatabase) {
    configs.database = process.env.DB_MYSQL_DATABASE;
  }

  return configs;
}
