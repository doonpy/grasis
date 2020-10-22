import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';
import { LecturerAdminController } from './admin.controller';
import { LecturerController } from './lecturer.controller';
import { LecturerEntity } from './lecturer.entity';
import { LecturerService } from './lecturer.service';

@Module({
  imports: [TypeOrmModule.forFeature([LecturerEntity]), UserModule],
  providers: [LecturerService],
  controllers: [LecturerController, LecturerAdminController],
  exports: [LecturerService]
})
export class LecturerModule {}
