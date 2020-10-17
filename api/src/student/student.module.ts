import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';
import { AdminStudentController } from './admin/admin.student.controller';
import { StudentController } from './student.controller';
import { StudentEntity } from './student.entity';
import { StudentService } from './student.service';

@Module({
  imports: [TypeOrmModule.forFeature([StudentEntity]), UserModule],
  providers: [StudentService],
  controllers: [StudentController, AdminStudentController],
  exports: [StudentService]
})
export class StudentModule {}
