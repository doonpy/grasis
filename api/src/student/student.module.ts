import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';
import { StudentController } from './student.controller';
import { Student } from './student.entity';
import { StudentService } from './student.service';

@Module({
  imports: [TypeOrmModule.forFeature([Student]), UserModule],
  providers: [StudentService],
  controllers: [StudentController],
  exports: [StudentService]
})
export class StudentModule {}
