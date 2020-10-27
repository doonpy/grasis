import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  Request,
  UseGuards
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommonParam, CommonQuery, CommonQueryValue } from '../common/common.resource';
import {
  commonIdValidateSchema,
  commonLimitValidateSchema,
  commonOffsetValidateSchema
} from '../common/common.validation';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { LecturerService } from '../lecturer/lecturer.service';
import { UserService } from '../user/user.service';
import { ThesisPermissionGuard } from './guards/thesis-permission.guard';
import { ThesisLecturerService } from './thesis-lecturer/thesis-lecturer.service';
import { ThesisStudentService } from './thesis-student/thesis-student.service';
import {
  Thesis,
  ThesisGetByIdResponse,
  ThesisGetManyResponse,
  ThesisLoadMoreLecturersResponse,
  ThesisLoadMoreStudentsResponse
} from './thesis.interface';
import { THESIS_ROOT_PATH, ThesisPath } from './thesis.resource';
import { ThesisService } from './thesis.service';

@UseGuards(JwtAuthGuard)
@Controller(THESIS_ROOT_PATH)
export class ThesisController {
  constructor(
    private readonly thesisService: ThesisService,
    private readonly lecturerService: LecturerService,
    private readonly thesisStudentService: ThesisStudentService,
    private readonly thesisLecturerService: ThesisLecturerService,
    private readonly userService: UserService
  ) {}

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
    @Request() req: Record<string, any>
  ): Promise<ThesisGetManyResponse> {
    const loginUserId = req.user.userId;
    const theses: Thesis[] = await this.thesisService.getMany(offset, limit, loginUserId);
    const total: number = await this.thesisService.getAmount();

    return {
      statusCode: HttpStatus.OK,
      theses,
      total
    };
  }

  @Get(ThesisPath.SPECIFY)
  @UseGuards(ThesisPermissionGuard)
  public async getById(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number
  ): Promise<ThesisGetByIdResponse> {
    const thesis = await this.thesisService.getById(id);
    const isMoreLecturers = await this.thesisLecturerService.isLoadMoreLecturersOfThesis(thesis.id);
    const isMoreStudents = await this.thesisStudentService.isLoadMoreStudentsOfThesis(thesis.id);

    return {
      statusCode: HttpStatus.OK,
      thesis,
      isMoreLecturers,
      isMoreStudents
    };
  }

  @Get(ThesisPath.LOAD_MORE_LECTURERS)
  @UseGuards(ThesisPermissionGuard)
  public async loadMoreLecturers(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number,
    @Query(
      CommonQuery.OFFSET,
      new JoiValidationPipe(commonOffsetValidateSchema),
      new DefaultValuePipe(CommonQueryValue.OFFSET),
      ParseIntPipe
    )
    offset: number,
    @Request() req: Record<string, any>
  ): Promise<ThesisLoadMoreLecturersResponse> {
    const loginUserId: number = req.user.userId;
    const loginUser = await this.userService.findById(loginUserId);
    await this.thesisService.checkThesisPermission(id, loginUser);
    const isMoreLecturers = await this.thesisLecturerService.isLoadMoreLecturersOfThesis(
      id,
      offset
    );
    if (!isMoreLecturers) {
      return {
        statusCode: HttpStatus.OK,
        lecturers: [],
        isMoreLecturers: false
      };
    }

    const lecturers = await this.thesisLecturerService.getThesisLecturersForView(id, offset);

    return {
      statusCode: HttpStatus.OK,
      lecturers,
      isMoreLecturers
    };
  }

  @Get(ThesisPath.LOAD_MORE_STUDENTS)
  @UseGuards(ThesisPermissionGuard)
  public async loadMoreStudents(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number,
    @Query(
      CommonQuery.OFFSET,
      new JoiValidationPipe(commonOffsetValidateSchema),
      new DefaultValuePipe(CommonQueryValue.OFFSET),
      ParseIntPipe
    )
    offset: number,
    @Request() req: Record<string, any>
  ): Promise<ThesisLoadMoreStudentsResponse> {
    const loginUserId: number = req.user.userId;
    const loginUser = await this.userService.findById(loginUserId);
    await this.thesisService.checkThesisPermission(id, loginUser);
    if (!(await this.thesisStudentService.isLoadMoreStudentsOfThesis(id))) {
      return {
        statusCode: HttpStatus.OK,
        students: [],
        isMoreStudents: false
      };
    }

    const students = await this.thesisStudentService.getThesisStudentsForView(id, offset);
    const isMoreStudents = await this.thesisStudentService.isLoadMoreStudentsOfThesis(id, offset);

    return {
      statusCode: HttpStatus.OK,
      students,
      isMoreStudents
    };
  }
}
