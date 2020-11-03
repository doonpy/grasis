import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ThesisAdminController } from './admin.controller';
import { ThesisLecturerEntity } from './thesis-lecturer/thesis-lecturer.entity';
import { ThesisLecturerService } from './thesis-lecturer/thesis-lecturer.service';
import { ThesisStudentEntity } from './thesis-student/thesis-student.entity';
import { ThesisStudentService } from './thesis-student/thesis-student.service';
import { ThesisController } from './thesis.controller';
import { ThesisEntity } from './thesis.entity';
import { ThesisService } from './thesis.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ThesisEntity, ThesisStudentEntity, ThesisLecturerEntity])],
  providers: [ThesisService, ThesisStudentService, ThesisLecturerService],
  controllers: [ThesisController, ThesisAdminController],
  exports: [ThesisService, ThesisStudentService, ThesisLecturerService]
})
export class ThesisModule {}
