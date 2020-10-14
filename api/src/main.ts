import { NestFactory } from '@nestjs/core';
import chalk from 'chalk';
import morgan from 'morgan';

import { AppModule } from './app.module';
import { isProductionMode } from './common/common.helper';
import { prependDatabase } from './mssql/mssql.helper';

async function bootstrap() {
  try {
    await prependDatabase();
    const app = await NestFactory.create(AppModule);

    if (!isProductionMode()) {
      const logFormat = `${chalk.magenta(`[:method] ${process.pid}`)}   - ${chalk.white(
        ':url :status :res[content-length]'
      )} ${chalk.red('+:response-time ms')}`;
      app.use(morgan(logFormat));
    }

    app.enableCors();
    await app.listen(process.env.PORT || 3000);
  } catch (error) {
    console.log(error);
  }
}

bootstrap();
