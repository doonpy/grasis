import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Sequelize } from 'sequelize-typescript';
import { getDatabaseConfig } from './mysql/mysql.helper';
import morgan from 'morgan';
import chalk from 'chalk';
import { isProductionMode } from './common/common.helper';

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

    if (!isProductionMode()) {
      const logFormat = `${chalk.magenta(
        `[:method] ${process.pid}`,
      )}   - ${chalk.white(':url :status :res[content-length]')} ${chalk.red(
        '+:response-time ms',
      )}`;
      app.use(morgan(logFormat));
    }

    app.enableCors();
    await app.listen(process.env.PORT || 3000);
  } catch (error) {
    console.log(error);
  }
}
bootstrap();
