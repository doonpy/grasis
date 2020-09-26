import { Module } from '@nestjs/common';
import { LecturerPositionService } from './lecturer-position.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { LecturerPosition } from './lecturer-position.model';
import { LecturerPositionController } from './lecturer-position.controller';

@Module({
  imports: [SequelizeModule.forFeature([LecturerPosition])],
  providers: [LecturerPositionService],
  exports: [LecturerPositionService],
  controllers: [LecturerPositionController]
})
export class LecturerPositionModule {}
