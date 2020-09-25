import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
    )
    offset: string,
    @Query(
      COMMON_QUERIES.LIMIT,
      new JoiValidationPipe(commonLimitValidateSchema),
    )
    limit: string,
  ): Promise<StudentFindAllResponse> {
    const students: Student[] = await this.studentService.findAll(
      parseInt(offset) || COMMON_QUERIES_VALUE.OFFSET,
      parseInt(limit) || COMMON_QUERIES_VALUE.LIMIT,
    );
    const currentAmount: number = await this.studentService.getStudentAmount();
    const isNext = currentAmount - students.length - parseInt(offset) > 0;

    return {
      statusCode: HttpStatus.OK,
      students,
      isNext,
    };
  }

  @Get(STD_CONTROLLER_RESOURCE.PATH.SPECIFY)
  public async findById(
    @Param(COMMON_PARAMS.ID, new JoiValidationPipe(commonIdValidateSchema))
    id: string,
  ): Promise<StudentFindByIdResponse> {
    const student: Student = await this.studentService.findByUserId(
      parseInt(id),
    );

    return {
      statusCode: HttpStatus.OK,
      student,
    };
  }

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
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
  @HttpCode(HttpStatus.NO_CONTENT)
  public async updateById(
    @Param(
      STD_CONTROLLER_RESOURCE.PARAM.ID,
      new JoiValidationPipe(commonIdValidateSchema),
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
      STD_CONTROLLER_RESOURCE.PARAM.ID,
      new JoiValidationPipe(commonIdValidateSchema),
    )
    id: number,
  ): Promise<void> {
    await this.studentService.deleteById(id);
  }
}
