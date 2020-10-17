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
import { JoiValidationPipe } from '../common/pipe/joi-validation.pipe';
import { UserType } from '../user/user.resource';
import { LecturerRequestBody, LecturerView } from './lecturer.interface';
import { LEC_CONTROLLER_RESOURCE } from './lecturer.resource';
import { LecturerService } from './lecturer.service';
import {
  lecturerCreateValidationSchema,
  lecturerUpdateValidationSchema
} from './lecturer.validation';

interface LecturerFindAllResponse extends CommonFindAllResponse {
  lecturers: LecturerView[];
}

interface LecturerFindByIdResponse extends CommonResponse {
  lecturer: LecturerView;
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
    const lecturers: LecturerView[] = await this.lecturerService.findAll(offset, limit);
    const total: number = await this.lecturerService.getLecturerAmount();

    return {
      statusCode: HttpStatus.OK,
      lecturers,
      total
    };
  }

  @Get(LEC_CONTROLLER_RESOURCE.PATH.SPECIFY)
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
  ): Promise<LecturerFindByIdResponse> {
    const lecturer: LecturerView = await this.lecturerService.findById(id);

    return {
      statusCode: HttpStatus.OK,
      lecturer
    };
  }

  @Post()
  @UseGuards(AdminGuard)
  @UsePipes(new JoiValidationPipe(lecturerCreateValidationSchema))
  public async create(@Body() body: LecturerRequestBody): Promise<LecturerCreateOrUpdateResponse> {
    const createdLecturer: LecturerView = await this.lecturerService.create(body);

    return {
      statusCode: HttpStatus.CREATED,
      id: createdLecturer.id as number
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
    @Body(new JoiValidationPipe(lecturerUpdateValidationSchema)) body: LecturerRequestBody
  ): Promise<LecturerCreateOrUpdateResponse> {
    await this.lecturerService.updateById(id, body);

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
