import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AppService } from './app.service';

@Injectable()
export class AppPrepend implements OnApplicationBootstrap {
  constructor(private readonly appService: AppService) {}

  public async onApplicationBootstrap(): Promise<void> {
    await this.appService.testConnectToMySQL();
    await this.appService.initDatabase();
    await this.appService.closeConnection();
  }
}
