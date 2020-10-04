import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { ConnectionOptions, createConnection } from 'typeorm';

import { isProductionMode } from '../common/common.helper';
import { Lecturer } from '../lecturer/lecturer.entity';
import { Student } from '../student/student.entity';
import { User } from '../user/user.entity';

export function getDatabaseConfig(): TypeOrmModuleOptions {
  return {
    type: 'mssql',
    entities: [User, Lecturer, Student],
    host: process.env.DB_MSSQL_HOST,
    port: parseInt(process.env.DB_MSSQL_PORT || '1433'),
    username: process.env.DB_MSSQL_USERNAME,
    password: process.env.DB_MSSQL_PASSWORD,
    logging: !isProductionMode(),
    synchronize: !isProductionMode(),
    database: process.env.DB_MSSQL_DATABASE,
    autoLoadEntities: !isProductionMode(),
    cache: true
  };
}

export function getDatabaseConfigsForPrepend(): ConnectionOptions {
  return {
    type: 'mssql',
    host: process.env.DB_MSSQL_HOST,
    port: parseInt(process.env.DB_MSSQL_PORT || '1433'),
    username: process.env.DB_MSSQL_USERNAME,
    password: process.env.DB_MSSQL_PASSWORD
  };
}

export async function prependDatabase(): Promise<void> {
  const client = await createConnection(getDatabaseConfigsForPrepend());
  const queryStr = `IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = '${process.env.DB_MSSQL_DATABASE}') BEGIN CREATE DATABASE ${process.env.DB_MSSQL_DATABASE}; END;`;
  await client.query(queryStr);
  await client.close();
}
