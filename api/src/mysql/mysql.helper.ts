import { SequelizeModuleOptions } from '@nestjs/sequelize';
import chalk from 'chalk';
import { isProductionDatabase, isProductionMode } from '../common/common.helper';
import { Student } from '../student/student.model';
import { User } from '../user/user.model';
import { LecturerPosition } from '../lecturer-position/lecturer-position.model';
import { Lecturer } from '../lecturer/lecturer.model';

export function getDatabaseConfig(includeDatabase: boolean): SequelizeModuleOptions {
  const configs: SequelizeModuleOptions = {
    dialect: 'mysql',
    models: [User, Student, LecturerPosition, Lecturer],
    host: process.env.DB_MYSQL_HOST,
    port: parseInt(process.env.DB_MYSQL_PORT || '3000'),
    username: process.env.DB_MYSQL_USERNAME,
    password: process.env.DB_MYSQL_PASSWORD,
    logging:
      !isProductionMode() &&
      function (log: string, timing?: number): void {
        console.log(
          `${chalk.cyan(`[MySQL] ${process.pid}`)}   - ${chalk.blue(log)} ${chalk.red(
            `+${timing}ms`
          )}`
        );
      },
    benchmark: !isProductionMode(),
    logQueryParameters: !isProductionMode(),
    autoLoadModels: true,
    sync: {
      alter: true,
      force: !isProductionDatabase()
    },
    timezone: process.env.DB_MYSQL_TIMEZONE
  };

  if (includeDatabase) {
    configs.database = process.env.DB_MYSQL_DATABASE;
  }

  return configs;
}
