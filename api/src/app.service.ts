import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Sequelize } from 'sequelize';
import { UserService } from './user/user.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private sequelize: Sequelize, private userService: UserService) {}

  getHello(): string {
    return "Hello World! I'm Groot";
  }

  async onApplicationBootstrap(): Promise<void> {
    const createUserQuery = `INSERT IGNORE INTO \`user\` (\`id\`,\`username\`,\`password\`,\`createdAt\`,\`updatedAt\`) VALUES (DEFAULT, "${
      process.env.ADMIN_USERNAME
    }", "${this.userService.hashPassword(
      process.env.ADMIN_PASSWORD || 'Administrator',
      process.env.ADMIN_USERNAME || 'admin'
    )}", CURRENT_TIME, CURRENT_TIME);`;
    await this.sequelize.query(createUserQuery);

    const createLecturerQuery = ` INSERT IGNORE INTO \`lecturer\` (\`id\`,\`isAdmin\`,\`createdAt\`,\`updatedAt\`) VALUES (1, 1, CURRENT_TIME, CURRENT_TIME);`;
    await this.sequelize.query(createLecturerQuery);
  }
}
