import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Sequelize } from 'sequelize-typescript';
import { getDatabaseConfig } from './mysql/mysql.helper';

async function prependDatabase(): Promise<void> {
  const client = new Sequelize(getDatabaseConfig(false));
  const queryStr = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_MYSQL_DATABASE};`;
  await client.authenticate();
  await client.query(queryStr);
  await client.close();
}

async function bootstrap() {
  try {
    await prependDatabase();

    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.listen(process.env.PORT || 3000);
  } catch (error) {
    console.log(error);
  }
}
bootstrap();
