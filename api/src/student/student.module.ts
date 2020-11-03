import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StudentAdminController } from './admin.controller';
import { StudentController } from './student.controller';
import { StudentEntity } from './student.entity';
import { StudentService } from './student.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([StudentEntity])],
  providers: [StudentService],
  controllers: [StudentController, StudentAdminController],
  exports: [StudentService]
})
export class StudentModule {}
