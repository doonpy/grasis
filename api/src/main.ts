import { NestFactory } from '@nestjs/core';
import chalk from 'chalk';
import morgan from 'morgan';

import { AppModule } from './app.module';
import { isProductionMode } from './common/common.helper';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (!isProductionMode()) {
    const logFormat = `${chalk.magenta(`[:method] ${process.pid}`)}   - ${chalk.white(
      ':url :status :res[content-length]'
    )} ${chalk.red('+:response-time ms')}`;
    app.use(morgan(logFormat));
  }

  app.enableCors();
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
