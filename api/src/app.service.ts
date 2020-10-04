import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

import { LecturerService } from './lecturer/lecturer.service';
import { User } from './user/user.entity';
import { IsAdmin, UserType } from './user/user.resource';
import { UserService } from './user/user.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private userService: UserService, private lecturerService: LecturerService) {}

  getHello(): string {
    return "Hello World! I'm Groot";
  }

  async onApplicationBootstrap(): Promise<void> {
    if (
      !(await this.userService.isUserExistByUsername(process.env.ADMIN_USERNAME || 'Administrator'))
    ) {
      const user: Partial<User> = {
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
        isAdmin: IsAdmin.TRUE,
        userType: UserType.LECTURER
      };
      await this.lecturerService.create(user, {});
    }
  }
}
