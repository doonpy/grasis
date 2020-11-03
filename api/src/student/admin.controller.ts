import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommonParam, CommonQuery, CommonQueryValue } from '../common/common.resource';
import {
  commonIdValidateSchema,
  commonLimitValidateSchema,
  commonOffsetValidateSchema
} from '../common/common.validation';
import { AdminGuard } from '../common/guards/admin.guard';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { ParseUserRequestBodyPipe } from '../user/pipes/parse-user-request-body.pipe';
import { UserRequestBody } from '../user/user.interface';
import {
  userCreateValidationSchemaForStudent,
  userUpdateValidationSchemaForStudent
} from '../user/user.validation';
import {
  Student,
  StudentCreateOrUpdateResponse,
  StudentFindByIdResponse,
  StudentFindManyResponse,
  StudentRequestBody,
  StudentSearchAttendeesResponse
} from './student.interface';
import { StudentBodyProps, StudentPath, StudentSearchType } from './student.resource';
import { StudentService } from './student.service';
import { studentValidationSchema } from './student.validation';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller(StudentPath.ADMIN_ROOT)
export class StudentAdminController {
  constructor(private studentService: StudentService) {}

  @Get()
  public async getMany(
    @Query(
      CommonQuery.OFFSET,
      new JoiValidationPipe(commonOffsetValidateSchema),
      new DefaultValuePipe(CommonQueryValue.OFFSET),
      ParseIntPipe
    )
    offset: number,
    @Query(
      CommonQuery.LIMIT,
      new JoiValidationPipe(commonLimitValidateSchema),
      new DefaultValuePipe(CommonQueryValue.LIMIT),
      ParseIntPipe
    )
    limit: number,
    @Query(CommonQuery.KEYWORD, new DefaultValuePipe(undefined)) keyword: string
  ): Promise<StudentFindManyResponse> {
    const students: Student[] = await this.studentService.getMany(offset, limit, keyword);
    const total: number = await this.studentService.getStudentAmount(keyword);

    return {
      statusCode: HttpStatus.OK,
      students,
      total
    };
  }

  @Get(StudentPath.SPECIFY)
  public async getById(
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

  @Post()
  public async create(
    @Body(
      StudentBodyProps.USER,
      new JoiValidationPipe(userCreateValidationSchemaForStudent),
      ParseUserRequestBodyPipe
    )
    user: UserRequestBody,
    @Body(StudentBodyProps.STUDENT, new JoiValidationPipe(studentValidationSchema))
    student: StudentRequestBody
  ): Promise<StudentCreateOrUpdateResponse> {
    const createdStudent = await this.studentService.create(user, student);

    return {
      statusCode: HttpStatus.CREATED,
      id: createdStudent.user.id
    };
  }

  @Patch(StudentPath.SPECIFY)
  @UseGuards(AdminGuard)
  public async updateById(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number,
    @Body(
      StudentBodyProps.USER,
      new JoiValidationPipe(userUpdateValidationSchemaForStudent),
      ParseUserRequestBodyPipe
    )
    user: UserRequestBody,
    @Body(StudentBodyProps.STUDENT, new JoiValidationPipe(studentValidationSchema))
    student: StudentRequestBody
  ): Promise<StudentCreateOrUpdateResponse> {
    await this.studentService.updateById(id, user, student);

    return {
      statusCode: HttpStatus.OK,
      id
    };
  }

  @Delete(StudentPath.SPECIFY)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteById(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number
  ): Promise<void> {
    await this.studentService.deleteById(id);
  }

  @Get(StudentPath.SEARCH_ATTENDEES)
  public async searchAttendees(
    @Query(CommonQuery.KEYWORD) keyword: string,
    @Query(CommonQuery.SEARCH_TYPES) searchType: StudentSearchType[]
  ): Promise<StudentSearchAttendeesResponse> {
    const result = await this.studentService.searchAttendees(keyword, searchType);

    return {
      statusCode: HttpStatus.OK,
      result
    };
  }
}
