import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ThesisModule } from '../thesis/thesis.module';
import { UserModule } from '../user/user.module';
import { StudentAdminController } from './admin.controller';
import { StudentController } from './student.controller';
import { StudentEntity } from './student.entity';
import { StudentService } from './student.service';

@Module({
  imports: [TypeOrmModule.forFeature([StudentEntity]), UserModule, forwardRef(() => ThesisModule)],
  providers: [StudentService],
  controllers: [StudentController, StudentAdminController],
  exports: [StudentService]
})
export class StudentModule {}
