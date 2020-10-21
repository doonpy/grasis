import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LecturerModule } from '../lecturer/lecturer.module';
import { StudentModule } from '../student/student.module';
import { UserModule } from '../user/user.module';
import { AdminController } from './admin/admin.controller';
import { ThesisLecturerEntity } from './thesis-lecturer/thesis-lecturer.entity';
import { ThesisLecturerService } from './thesis-lecturer/thesis-lecturer.service';
import { ThesisStudentEntity } from './thesis-student/thesis-student.entity';
import { ThesisStudentService } from './thesis-student/thesis-student.service';
import { ThesisController } from './thesis.controller';
import { ThesisEntity } from './thesis.entity';
import { ThesisService } from './thesis.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ThesisEntity, ThesisLecturerEntity, ThesisStudentEntity]),
    LecturerModule,
    StudentModule,
    UserModule
  ],
  providers: [ThesisService, ThesisLecturerService, ThesisStudentService],
  controllers: [ThesisController, AdminController]
})
export class ThesisModule {}
