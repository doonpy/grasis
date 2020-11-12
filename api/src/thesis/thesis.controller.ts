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
import { PermissionGuard } from './guards/permission.guard';
import { ThesisLecturerService } from './thesis-lecturer/thesis-lecturer.service';
import { ThesisGetThesisLecturersResponse } from './thesis-lecturer/thesis-lecturer.type';
import { ThesisStudentService } from './thesis-student/thesis-student.service';
import { ThesisGetThesisStudentsResponse } from './thesis-student/thesis-student.type';
import { THESIS_ROOT_PATH, ThesisPath } from './thesis.resource';
import { ThesisService } from './thesis.service';
import { ThesisForListView, ThesisGetByIdResponse, ThesisGetManyResponse } from './thesis.type';

@UseGuards(JwtAuthGuard)
@Controller(THESIS_ROOT_PATH)
export class ThesisController {
  constructor(
    private readonly thesisService: ThesisService,
    private readonly lecturerService: LecturerService,
    private readonly thesisStudentService: ThesisStudentService,
    private readonly thesisLecturerService: ThesisLecturerService
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
    @Request() req: Record<string, any>,
    @Query(CommonQuery.KEYWORD, new DefaultValuePipe(undefined)) keyword: string
  ): Promise<ThesisGetManyResponse> {
    const loginUserId = req.user.userId;
    const theses: ThesisForListView[] = await this.thesisService.getManyForView(
      offset,
      limit,
      loginUserId,
      keyword
    );
    const total: number = await this.thesisService.getAmount(loginUserId, keyword);

    return {
      statusCode: HttpStatus.OK,
      theses,
      total
    };
  }

  @Get(ThesisPath.SPECIFY)
  @UseGuards(PermissionGuard)
  public async getById(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number
  ): Promise<ThesisGetByIdResponse> {
    const thesis = await this.thesisService.getByIdForView(id);

    return {
      statusCode: HttpStatus.OK,
      thesis
    };
  }

  @Get(ThesisPath.GET_THESIS_STUDENTS)
  @UseGuards(PermissionGuard)
  public async getThesisStudents(
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
    @Query(
      CommonQuery.LIMIT,
      new JoiValidationPipe(commonLimitValidateSchema),
      new DefaultValuePipe(CommonQueryValue.LIMIT),
      ParseIntPipe
    )
    limit: number,
    @Query(CommonQuery.KEYWORD, new DefaultValuePipe(undefined)) keyword: string
  ): Promise<ThesisGetThesisStudentsResponse> {
    const students = await this.thesisStudentService.getThesisStudentsForView(
      offset,
      limit,
      id,
      keyword
    );
    const total = await this.thesisStudentService.getAmountStudentAttendee(id, keyword);

    return {
      statusCode: HttpStatus.OK,
      students,
      total
    };
  }

  @Get(ThesisPath.GET_THESIS_LECTURERS)
  @UseGuards(PermissionGuard)
  public async getThesisLecturers(
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
    @Query(
      CommonQuery.LIMIT,
      new JoiValidationPipe(commonLimitValidateSchema),
      new DefaultValuePipe(CommonQueryValue.LIMIT),
      ParseIntPipe
    )
    limit: number,
    @Query(CommonQuery.KEYWORD, new DefaultValuePipe(undefined)) keyword: string
  ): Promise<ThesisGetThesisLecturersResponse> {
    const lecturers = await this.thesisLecturerService.getThesisLecturersForView(
      offset,
      limit,
      id,
      keyword
    );
    const total = await this.thesisLecturerService.getAmountLecturerAttendee(id, keyword);

    return {
      statusCode: HttpStatus.OK,
      lecturers,
      total
    };
  }
}
