import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import chalk from 'chalk';
import { Connection } from 'typeorm';

import { isProductionMode } from './common/common.helper';
import { LecturerService } from './lecturer/lecturer.service';
import { UserRequestBody } from './user/user.interface';
import { IsAdmin } from './user/user.resource';
import { UserService } from './user/user.service';

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
    if (isProductionMode()) {
      Logger.log(chalk.yellow(`=> Run migrations...`));
      await this.connection.runMigrations({ transaction: true });
      Logger.log(chalk.yellow(`=> Run migrations... Done!`));
    }

    if (!(await this.userService.isUserExistById(1))) {
      const user: UserRequestBody = {
        username: process.env.ADMIN_USERNAME as string,
        password: process.env.ADMIN_PASSWORD as string,
        confirmPassword: process.env.ADMIN_PASSWORD as string,
        isAdmin: IsAdmin.TRUE
      };
      await this.lecturerService.create(user);
    }
  }
}
