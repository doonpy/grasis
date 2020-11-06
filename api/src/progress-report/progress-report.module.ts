import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProgressReportAdminController } from './admin.controller';
import { ProgressReportController } from './progress-report.controller';
import { ProgressReportEntity } from './progress-report.entity';
import { ProgressReportService } from './progress-report.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ProgressReportEntity])],
  providers: [ProgressReportService],
  controllers: [ProgressReportController, ProgressReportAdminController],
  exports: [ProgressReportService]
})
export class ProgressReportModule {}
