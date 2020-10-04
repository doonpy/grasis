import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';
import { LecturerController } from './lecturer.controller';
import { Lecturer } from './lecturer.entity';
import { LecturerService } from './lecturer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Lecturer]), UserModule],
  providers: [LecturerService],
  controllers: [LecturerController],
  exports: [LecturerService]
})
export class LecturerModule {}
