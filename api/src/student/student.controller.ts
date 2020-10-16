import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { COMMON_PARAMS, COMMON_QUERIES, COMMON_QUERIES_VALUE } from '../common/common.resource';
import {
  commonIdValidateSchema,
  commonLimitValidateSchema,
  commonOffsetValidateSchema
} from '../common/common.validation';
import { UserTypes } from '../common/decorator/user-type.decorator';
import { UserPermissionGuard } from '../common/guard/user-permission.guard';
import { UserTypeGuard } from '../common/guard/user-type.guard';
import { JoiValidationPipe } from '../pipe/joi-validation.pipe';
import { UserType } from '../user/user.resource';
import {
  StudentCreateOrUpdateResponse,
  StudentFindAllResponse,
  StudentFindByIdResponse,
  StudentRequestBody,
  StudentView
} from './student.interface';
import { STD_CONTROLLER_RESOURCE } from './student.resource';
import { StudentService } from './student.service';
import { studentUpdateValidationSchemaForUser } from './student.validation';

@UseGuards(JwtAuthGuard)
@Controller(STD_CONTROLLER_RESOURCE.PATH.ROOT)
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get()
  @UserTypes(UserType.LECTURER)
  @UseGuards(UserTypeGuard)
  public async findAll(
    @Query(
      COMMON_QUERIES.OFFSET,
      new JoiValidationPipe(commonOffsetValidateSchema),
      new DefaultValuePipe(COMMON_QUERIES_VALUE.OFFSET),
      ParseIntPipe
    )
    offset: number,
    @Query(
      COMMON_QUERIES.LIMIT,
      new JoiValidationPipe(commonLimitValidateSchema),
      new DefaultValuePipe(COMMON_QUERIES_VALUE.LIMIT),
      ParseIntPipe
    )
    limit: number
  ): Promise<StudentFindAllResponse> {
    const students: StudentView[] = await this.studentService.findAll(offset, limit);
    const total: number = await this.studentService.getStudentAmount();

    return {
      statusCode: HttpStatus.OK,
      students,
      total
    };
  }

  @Get(STD_CONTROLLER_RESOURCE.PATH.SPECIFY)
  @UserTypes(UserType.LECTURER, UserType.STUDENT)
  @UseGuards(UserTypeGuard)
  public async findById(
    @Param(
      COMMON_PARAMS.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(COMMON_QUERIES_VALUE.FAILED_ID),
      ParseIntPipe
    )
    id: number
  ): Promise<StudentFindByIdResponse> {
    const student: StudentView = await this.studentService.findById(id);

    return {
      statusCode: HttpStatus.OK,
      student
    };
  }

  @Patch(STD_CONTROLLER_RESOURCE.PATH.SPECIFY)
  @UserTypes(UserType.STUDENT)
  @UseGuards(UserTypeGuard)
  @UseGuards(UserPermissionGuard)
  public async updateById(
    @Param(
      COMMON_PARAMS.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(COMMON_QUERIES_VALUE.FAILED_ID),
      ParseIntPipe
    )
    id: number,
    @Body(new JoiValidationPipe(studentUpdateValidationSchemaForUser))
    body: StudentRequestBody
  ): Promise<StudentCreateOrUpdateResponse> {
    await this.studentService.updateById(id, body);

    return {
      statusCode: HttpStatus.OK,
      id
    };
  }
}
