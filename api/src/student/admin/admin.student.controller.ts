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
  UseGuards,
  UsePipes
} from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { COMMON_PARAMS, COMMON_QUERIES, COMMON_QUERIES_VALUE } from '../../common/common.resource';
import {
  commonIdValidateSchema,
  commonLimitValidateSchema,
  commonOffsetValidateSchema
} from '../../common/common.validation';
import { AdminGuard } from '../../common/guards/admin.guard';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { DeleteUserGuard } from '../../user/guards/delete-user.guard';
import { ParseUserRequestBodyPipe } from '../../user/pipes/parse-user-request-body.pipe';
import {
  StudentCreateOrUpdateResponse,
  StudentFindAllResponse,
  StudentFindByIdResponse,
  StudentRequestBody,
  StudentView
} from '../student.interface';
import { STD_CONTROLLER_RESOURCE } from '../student.resource';
import { StudentService } from '../student.service';
import {
  studentCreateValidationSchema,
  studentUpdateValidationSchema
} from '../student.validation';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller(STD_CONTROLLER_RESOURCE.PATH.ADMIN_ROOT)
export class AdminStudentController {
  constructor(private studentService: StudentService) {}

  @Get()
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

  @Post()
  @UsePipes(new JoiValidationPipe(studentCreateValidationSchema))
  public async create(
    @Body(new ParseUserRequestBodyPipe())
    body: StudentRequestBody
  ): Promise<StudentCreateOrUpdateResponse> {
    const createdStudent = await this.studentService.create(body);

    return {
      statusCode: HttpStatus.CREATED,
      id: createdStudent.id as number
    };
  }

  @Patch(STD_CONTROLLER_RESOURCE.PATH.SPECIFY)
  @UseGuards(AdminGuard)
  public async updateById(
    @Param(
      COMMON_PARAMS.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(COMMON_QUERIES_VALUE.FAILED_ID),
      ParseIntPipe
    )
    id: number,
    @Body(new JoiValidationPipe(studentUpdateValidationSchema), new ParseUserRequestBodyPipe())
    body: StudentRequestBody
  ): Promise<StudentCreateOrUpdateResponse> {
    await this.studentService.updateById(id, body);

    return {
      statusCode: HttpStatus.OK,
      id
    };
  }

  @Delete(STD_CONTROLLER_RESOURCE.PATH.SPECIFY)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(DeleteUserGuard)
  public async deleteById(
    @Param(
      COMMON_PARAMS.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(COMMON_QUERIES_VALUE.FAILED_ID),
      ParseIntPipe
    )
    id: number
  ): Promise<void> {
    await this.studentService.deleteById(id);
  }
}
