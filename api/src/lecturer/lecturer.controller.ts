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
import { JoiValidationPipe } from '../pipe/joi-validation.pipe';
import { User } from '../user/user.entity';
import { userCreateValidationSchema, userUpdateValidationSchema } from '../user/user.validation';
import { Lecturer } from './lecturer.entity';
import { LEC_CONTROLLER_RESOURCE } from './lecturer.resource';
import { LecturerService } from './lecturer.service';
import { lecturerUpdateValidationSchema } from './lecturer.validation';

interface LecturerFindAllResponse extends CommonFindAllResponse {
  lecturers: Lecturer[];
}

interface LecturerFindByIdResponse extends CommonResponse {
  lecturer: Lecturer;
}

@UseGuards(JwtAuthGuard)
@Controller(LEC_CONTROLLER_RESOURCE.PATH.ROOT)
export class LecturerController {
  constructor(private lecturerService: LecturerService) {}

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
  ): Promise<LecturerFindAllResponse> {
    const lecturers: Lecturer[] = await this.lecturerService.findAll(offset, limit);
    const currentAmount: number = await this.lecturerService.getLecturerAmount();
    const isNext = currentAmount - lecturers.length - offset > 0;

    return {
      statusCode: HttpStatus.OK,
      lecturers,
      isNext
    };
  }

  @Get(LEC_CONTROLLER_RESOURCE.PATH.SPECIFY)
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
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Body(LEC_CONTROLLER_RESOURCE.PARAM.USER, new JoiValidationPipe(userCreateValidationSchema))
    user: User,
    @Body(LEC_CONTROLLER_RESOURCE.PARAM.LECTURER)
    lecturer: Lecturer
  ): Promise<void> {
    await this.lecturerService.create(user, lecturer);
  }

  @Patch(LEC_CONTROLLER_RESOURCE.PATH.SPECIFY)
  @HttpCode(HttpStatus.OK)
  public async updateById(
    @Param(
      COMMON_PARAMS.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(COMMON_QUERIES_VALUE.FAILED_ID),
      ParseIntPipe
    )
    id: number,
    @Body(LEC_CONTROLLER_RESOURCE.PARAM.USER, new JoiValidationPipe(userUpdateValidationSchema))
    user: Partial<User>,
    @Body(
      LEC_CONTROLLER_RESOURCE.PARAM.LECTURER,
      new JoiValidationPipe(lecturerUpdateValidationSchema)
    )
    lecturer: Partial<Lecturer>
  ): Promise<void> {
    await this.lecturerService.updateById(id, user, lecturer);
  }

  @Delete(LEC_CONTROLLER_RESOURCE.PATH.SPECIFY)
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
