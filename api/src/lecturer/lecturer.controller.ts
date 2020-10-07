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
import { CommonFindAllResponse, CommonResponse } from '../common/common.interface';
import { COMMON_PARAMS, COMMON_QUERIES, COMMON_QUERIES_VALUE } from '../common/common.resource';
import {
  commonIdValidateSchema,
  commonLimitValidateSchema,
  commonOffsetValidateSchema
} from '../common/common.validation';
import { UserTypes } from '../common/decorator/user-type.decorator';
import { AdminGuard } from '../common/guard/admin.guard';
import { UserPermissionGuard } from '../common/guard/user-permission.guard';
import { UserTypeGuard } from '../common/guard/user-type.guard';
import { JoiValidationPipe } from '../pipe/joi-validation.pipe';
import { UserRequestBody, UserType } from '../user/user.resource';
import { userCreateValidationSchema, userUpdateValidationSchema } from '../user/user.validation';
import { Lecturer } from './lecturer.entity';
import { LEC_CONTROLLER_RESOURCE } from './lecturer.resource';
import { LecturerService } from './lecturer.service';
import { lecturerValidationSchema } from './lecturer.validation';

interface LecturerFindAllResponse extends CommonFindAllResponse {
  lecturers: Lecturer[];
}

interface LecturerFindByIdResponse extends CommonResponse {
  lecturer: Lecturer;
}

interface LecturerCreateOrUpdateResponse extends CommonResponse {
  id: number;
}
@UseGuards(JwtAuthGuard)
@Controller(LEC_CONTROLLER_RESOURCE.PATH.ROOT)
export class LecturerController {
  constructor(private lecturerService: LecturerService) {}

  @Get()
  @UseGuards(AdminGuard)
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
  ): Promise<LecturerFindAllResponse> {
    const lecturers: Lecturer[] = await this.lecturerService.findAll(offset, limit);
    const total: number = await this.lecturerService.getLecturerAmount();

    return {
      statusCode: HttpStatus.OK,
      lecturers,
      total
    };
  }

  @Get(LEC_CONTROLLER_RESOURCE.PATH.SPECIFY)
  @UserTypes(UserType.LECTURER)
  @UseGuards(UserTypeGuard)
  public async findById(
    @Param(
      COMMON_PARAMS.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(COMMON_QUERIES_VALUE.FAILED_ID),
      ParseIntPipe
    )
    id: number
  ): Promise<LecturerFindByIdResponse> {
    const lecturer: Lecturer = await this.lecturerService.findById(id);

    return {
      statusCode: HttpStatus.OK,
      lecturer
    };
  }

  @Post()
  @UseGuards(AdminGuard)
  public async create(
    @Body(LEC_CONTROLLER_RESOURCE.PARAM.USER, new JoiValidationPipe(userCreateValidationSchema))
    user: UserRequestBody,
    @Body(LEC_CONTROLLER_RESOURCE.PARAM.LECTURER, new JoiValidationPipe(lecturerValidationSchema))
    lecturer: Lecturer
  ): Promise<LecturerCreateOrUpdateResponse> {
    const createdLecturer: Lecturer = await this.lecturerService.create(user, lecturer);

    return {
      statusCode: HttpStatus.CREATED,
      id: createdLecturer.id
    };
  }

  @Patch(LEC_CONTROLLER_RESOURCE.PATH.SPECIFY)
  @UserTypes(UserType.LECTURER)
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
    @Body(LEC_CONTROLLER_RESOURCE.PARAM.USER, new JoiValidationPipe(userUpdateValidationSchema))
    user: Partial<UserRequestBody>,
    @Body(LEC_CONTROLLER_RESOURCE.PARAM.LECTURER, new JoiValidationPipe(lecturerValidationSchema))
    lecturer: Partial<Lecturer>
  ): Promise<LecturerCreateOrUpdateResponse> {
    await this.lecturerService.updateById(id, user, lecturer);

    return {
      statusCode: HttpStatus.OK,
      id
    };
  }

  @Delete(LEC_CONTROLLER_RESOURCE.PATH.SPECIFY)
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteById(
    @Param(
      COMMON_PARAMS.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(COMMON_QUERIES_VALUE.FAILED_ID),
      ParseIntPipe
    )
    id: number
  ): Promise<void> {
    await this.lecturerService.deleteById(id);
  }
}
