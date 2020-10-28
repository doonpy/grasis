import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LecturerModule } from '../lecturer/lecturer.module';
import { StudentModule } from '../student/student.module';
import { UserModule } from '../user/user.module';
import { ThesisAdminController } from './admin.controller';
import { ThesisLecturerEntity } from './thesis-lecturer/thesis-lecturer.entity';
import { ThesisLecturerService } from './thesis-lecturer/thesis-lecturer.service';
import { ThesisStudentEntity } from './thesis-student/thesis-student.entity';
import { ThesisStudentService } from './thesis-student/thesis-student.service';
import { ThesisController } from './thesis.controller';
import { ThesisEntity } from './thesis.entity';
import { ThesisService } from './thesis.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ThesisEntity, ThesisStudentEntity, ThesisLecturerEntity]),
    forwardRef(() => LecturerModule),
    forwardRef(() => StudentModule),
    UserModule
  ],
  providers: [ThesisService, ThesisStudentService, ThesisLecturerService],
  controllers: [ThesisController, ThesisAdminController],
  exports: [ThesisService, ThesisStudentService, ThesisLecturerService]
})
export class ThesisModule {}
