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
} from '@nestjs/common';
import { Student } from './student.model';
import { StudentService } from './student.service';
import { STD_CONTROLLER_RESOURCE } from './student.resource';
import { User } from '../user/user.model';
import { JoiValidationPipe } from '../pipe/joi-validation.pipe';
import {
  commonIdValidateSchema,
  commonLimitValidateSchema,
  commonOffsetValidateSchema,
} from '../common/common.validation';
import {
  COMMON_PARAMS,
  COMMON_QUERIES,
  COMMON_QUERIES_VALUE,
} from '../common/common.resource';
import {
  studentCreateValidationSchema,
  studentUpdateValidationSchema,
} from './student.validation';
import {
  CommonFindAllResponse,
  CommonResponse,
} from '../common/common.interface';
import {
  userCreateValidationSchema,
  userUpdateValidationSchema,
} from '../user/user.validation';

interface StudentFindAllResponse extends CommonFindAllResponse {
  students: Student[];
}

interface StudentFindByIdResponse extends CommonResponse {
  student: Student;
}

@Controller(STD_CONTROLLER_RESOURCE.PATH.ROOT)
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get()
  public async findAll(
    @Query(
      COMMON_QUERIES.OFFSET,
      new JoiValidationPipe(commonOffsetValidateSchema),
      new DefaultValuePipe(COMMON_QUERIES_VALUE.OFFSET),
      ParseIntPipe,
    )
    offset: number,
    @Query(
      COMMON_QUERIES.LIMIT,
      new JoiValidationPipe(commonLimitValidateSchema),
      new DefaultValuePipe(COMMON_QUERIES_VALUE.LIMIT),
      ParseIntPipe,
    )
    limit: number,
  ): Promise<StudentFindAllResponse> {
    const students: Student[] = await this.studentService.findAll(
      offset || COMMON_QUERIES_VALUE.OFFSET,
      limit || COMMON_QUERIES_VALUE.LIMIT,
    );
    const currentAmount: number = await this.studentService.getStudentAmount();
    const isNext = currentAmount - students.length - offset > 0;

    return {
      statusCode: HttpStatus.OK,
      students,
      isNext,
    };
  }

  @Get(STD_CONTROLLER_RESOURCE.PATH.SPECIFY)
  public async findById(
    @Param(
      COMMON_PARAMS.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(COMMON_QUERIES_VALUE.FAILED_ID),
      ParseIntPipe,
    )
    id: number,
  ): Promise<StudentFindByIdResponse> {
    const student: Student = await this.studentService.findById(id);

    return {
      statusCode: HttpStatus.OK,
      student,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Body(
      STD_CONTROLLER_RESOURCE.PARAM.USER,
      new JoiValidationPipe(userCreateValidationSchema),
    )
    user: User,
    @Body(
      STD_CONTROLLER_RESOURCE.PARAM.STUDENT,
      new JoiValidationPipe(studentCreateValidationSchema),
    )
    student: Student,
  ): Promise<void> {
    await this.studentService.create(user, student);
  }

  @Patch(STD_CONTROLLER_RESOURCE.PATH.SPECIFY)
  @HttpCode(HttpStatus.OK)
  public async updateById(
    @Param(
      COMMON_PARAMS.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(COMMON_QUERIES_VALUE.FAILED_ID),
      ParseIntPipe,
    )
    id: number,
    @Body(
      STD_CONTROLLER_RESOURCE.PARAM.USER,
      new JoiValidationPipe(userUpdateValidationSchema),
    )
    user: Partial<User>,
    @Body(
      STD_CONTROLLER_RESOURCE.PARAM.STUDENT,
      new JoiValidationPipe(studentUpdateValidationSchema),
    )
    student: Partial<Student>,
  ): Promise<void> {
    await this.studentService.updateById(id, user, student);
  }

  @Delete(STD_CONTROLLER_RESOURCE.PATH.SPECIFY)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteById(
    @Param(
      COMMON_PARAMS.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(COMMON_QUERIES_VALUE.FAILED_ID),
      ParseIntPipe,
    )
    id: number,
  ): Promise<void> {
    await this.studentService.deleteById(id);
  }
}
