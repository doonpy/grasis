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
import { DeleteUserGuard } from '../user/guards/delete-user.guard';
import { UpdateUserGuard } from '../user/guards/update-user.guard';
import { ParseUserRequestBodyPipe } from '../user/pipes/parse-user-request-body.pipe';
import { UserRequestBody } from '../user/user.type';
import { userCreateValidationSchema, userUpdateValidationSchema } from '../user/user.validation';
import { LecturerBodyProps, LecturerPath, LecturerSearchType } from './lecturer.resource';
import { LecturerService } from './lecturer.service';
import {
  Lecturer,
  LecturerCreateOrUpdateResponse,
  LecturerFindByIdResponse,
  LecturerFindManyResponse,
  LecturerRequestBody,
  LecturerSearchAttendeesResponse
} from './lecturer.type';
import { lecturerValidationSchema } from './lecturer.validation';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller(LecturerPath.ADMIN_ROOT)
export class LecturerAdminController {
  constructor(private lecturerService: LecturerService) {}

  @Get()
  public async findMany(
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
  ): Promise<LecturerFindManyResponse> {
    const lecturers = await this.lecturerService.getManyForView(offset, limit, keyword);
    const total = await this.lecturerService.getLecturerAmount(keyword);

    return {
      statusCode: HttpStatus.OK,
      lecturers,
      total
    };
  }

  @Get(LecturerPath.SPECIFY)
  public async findById(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number
  ): Promise<LecturerFindByIdResponse> {
    const lecturer: Lecturer = await this.lecturerService.getById(id);

    return {
      statusCode: HttpStatus.OK,
      lecturer
    };
  }

  @Post()
  public async create(
    @Body(
      LecturerBodyProps.USER,
      new JoiValidationPipe(userCreateValidationSchema),
      ParseUserRequestBodyPipe
    )
    user: UserRequestBody,
    @Body(LecturerBodyProps.LECTURER, new JoiValidationPipe(lecturerValidationSchema))
    lecturer: LecturerRequestBody
  ): Promise<LecturerCreateOrUpdateResponse> {
    const createdLecturer: Lecturer = await this.lecturerService.create(user, lecturer);

    return {
      statusCode: HttpStatus.CREATED,
      id: createdLecturer.user.id
    };
  }

  @Patch(LecturerPath.SPECIFY)
  @UseGuards(UpdateUserGuard)
  public async updateById(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number,
    @Body(
      LecturerBodyProps.USER,
      new JoiValidationPipe(userUpdateValidationSchema),
      ParseUserRequestBodyPipe
    )
    user: UserRequestBody,
    @Body(LecturerBodyProps.LECTURER, new JoiValidationPipe(lecturerValidationSchema))
    lecturer: LecturerRequestBody
  ): Promise<LecturerCreateOrUpdateResponse> {
    await this.lecturerService.updateById(id, user, lecturer);

    return {
      statusCode: HttpStatus.OK,
      id
    };
  }

  @Delete(LecturerPath.SPECIFY)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(DeleteUserGuard)
  public async deleteById(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number
  ): Promise<void> {
    await this.lecturerService.deleteById(id);
  }

  @Get(LecturerPath.SEARCH_ATTENDEES)
  public async searchAttendees(
    @Query(CommonQuery.KEYWORD) keyword: string,
    @Query(CommonQuery.SEARCH_TYPES) searchType: LecturerSearchType[]
  ): Promise<LecturerSearchAttendeesResponse> {
    const result = await this.lecturerService.searchThesisAttendees(keyword, searchType);

    return {
      statusCode: HttpStatus.OK,
      result
    };
  }
}
