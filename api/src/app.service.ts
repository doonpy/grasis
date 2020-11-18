import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import chalk from 'chalk';
import { Connection } from 'typeorm';

import { isProductionMode, isReviewData } from './common/common.helper';
import { initReviewData } from './database/database.helper';
import { LecturerService } from './lecturer/lecturer.service';
import { IsAdmin } from './user/user.resource';
import { UserService } from './user/user.service';
import { UserRequestBody } from './user/user.type';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    private readonly userService: UserService,
    private readonly lecturerService: LecturerService,
    private readonly connection: Connection
  ) {}

  getHello(): string {
    return "Hello World! I'm Groot";
  }

  async onApplicationBootstrap(): Promise<void> {
    if (isProductionMode() && !isReviewData()) {
      Logger.log(chalk.yellow('Run migrations...'));
      await this.connection.runMigrations({ transaction: true });
      Logger.log(chalk.yellow('Run migrations... Done!'));
    }

    if (isReviewData()) {
      Logger.log(chalk.yellow('Initialize review data...'));
      await initReviewData(this.connection);
      Logger.log(chalk.yellow('Initialize review data... Done!'));
    }

    if (
      !(await this.userService.isUserExistById(1)) &&
      !(await this.userService.isUserExistByUsername(process.env.ADMIN_USERNAME || 'Administrator'))
    ) {
      Logger.log(chalk.yellow('Create administrator account...'));
      const user: UserRequestBody = {
        username: process.env.ADMIN_USERNAME as string,
        password: process.env.ADMIN_PASSWORD as string,
        confirmPassword: process.env.ADMIN_PASSWORD as string,
        firstname: process.env.ADMIN_USERNAME,
        isAdmin: IsAdmin.TRUE
      };
      await this.lecturerService.create(user);
      Logger.log(chalk.yellow('Create administrator account.. Done!'));
    }
  }
}
