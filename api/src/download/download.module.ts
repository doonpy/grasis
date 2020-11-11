import { Global, Module } from '@nestjs/common';

import { DownloadController } from './download.controller';
import { DownloadService } from './download.service';

@Global()
@Module({
  providers: [DownloadService],
  controllers: [DownloadController]
})
export class DownloadModule {}
