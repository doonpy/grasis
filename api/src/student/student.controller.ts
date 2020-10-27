import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  UseGuards
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommonParam, CommonQueryValue } from '../common/common.resource';
import { commonIdValidateSchema } from '../common/common.validation';
import { UserTypes } from '../common/decorators/user-type.decorator';
import { UserTypeGuard } from '../common/guards/user-type.guard';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { UserType } from '../user/user.resource';
import { Student, StudentFindByIdResponse } from './student.interface';
import { StudentPath } from './student.resource';
import { StudentService } from './student.service';

@UseGuards(JwtAuthGuard)
@Controller(StudentPath.ROOT)
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get(StudentPath.SPECIFY)
  @UserTypes(UserType.LECTURER, UserType.STUDENT)
  @UseGuards(UserTypeGuard)
  public async findById(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number
  ): Promise<StudentFindByIdResponse> {
    const student: Student = await this.studentService.findById(id);

    return {
      statusCode: HttpStatus.OK,
      student
    };
  }
}
