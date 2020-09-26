import { Module } from '@nestjs/common';
import { LecturerService } from './lecturer.service';
import { LecturerController } from './lecturer.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Lecturer } from './lecturer.model';
import { UserModule } from '../user/user.module';
import { LecturerPositionModule } from '../lecturer-position/lecturer-position.module';

@Module({
  imports: [SequelizeModule.forFeature([Lecturer]), UserModule, LecturerPositionModule],
  providers: [LecturerService],
  controllers: [LecturerController],
  exports: [LecturerService]
})
export class LecturerModule {}
