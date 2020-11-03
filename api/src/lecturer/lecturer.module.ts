import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LecturerAdminController } from './admin.controller';
import { LecturerController } from './lecturer.controller';
import { LecturerEntity } from './lecturer.entity';
import { LecturerService } from './lecturer.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([LecturerEntity])],
  providers: [LecturerService],
  controllers: [LecturerController, LecturerAdminController],
  exports: [LecturerService]
})
export class LecturerModule {}
