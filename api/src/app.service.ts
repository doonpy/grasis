import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { isProductionMode } from './common/common.helper';

@Injectable()
export class AppService {
  private readonly client: Sequelize;

  constructor() {
    this.client = new Sequelize(AppService.getMySQLDatabaseConfig(true));
  }

  getHello(): string {
    return "Hello World! I'm Groot";
  }

  public getClient(): Sequelize {
    return this.client;
  }

  public static getMySQLDatabaseConfig(
    isWithoutDatabase: boolean,
  ): SequelizeModuleOptions {
    const mySQLDatabaseConfig: SequelizeModuleOptions = {
      dialect: 'mysql',
      models: [],
      host: process.env.DB_MYSQL_HOST,
      port: parseInt(process.env.DB_MYSQL_PORT),
      username: process.env.DB_MYSQL_USERNAME,
      password: process.env.DB_MYSQL_PASSWORD,
      logging:
        !isProductionMode() &&
        function (log: string): void {
          console.log(`[MySQL] ${process.pid} - ${log}`);
        },
      benchmark: !isProductionMode(),
      logQueryParameters: !isProductionMode(),
    };

    if (!isWithoutDatabase) {
      mySQLDatabaseConfig.database = process.env.DB_MYSQL_DATABASE;
    }

    return mySQLDatabaseConfig;
  }

  public async initDatabase(): Promise<void> {
    const queryStr = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_MYSQL_DATABASE};`;
    await this.client.query(queryStr);
  }

  public async testConnectToMySQL(): Promise<void> {
    await this.client.authenticate();
  }

  public async closeConnection(): Promise<void> {
    await this.client.close();
  }
}
