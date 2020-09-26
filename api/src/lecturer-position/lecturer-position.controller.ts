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
import { LPO_CONTROLLER_RESOURCE } from './lecturer-position.resource';
import { LecturerPositionService } from './lecturer-position.service';
import {
  COMMON_PARAMS,
  COMMON_QUERIES,
  COMMON_QUERIES_VALUE,
} from '../common/common.resource';
import { JoiValidationPipe } from '../pipe/joi-validation.pipe';
import {
  commonIdValidateSchema,
  commonLimitValidateSchema,
  commonOffsetValidateSchema,
} from '../common/common.validation';
import {
  CommonFindAllResponse,
  CommonResponse,
} from '../common/common.interface';
import { LecturerPosition } from './lecturer-position.model';
import { lecturerPositionCreateValidationSchema } from './lecture-position.validation';

interface LecturerPositionFindAllResponse extends CommonFindAllResponse {
  lecturerPositions: LecturerPosition[];
}

interface LecturerPositionFindByIdResponse extends CommonResponse {
  lecturerPosition: LecturerPosition;
}

@Controller(LPO_CONTROLLER_RESOURCE.PATH.ROOT)
export class LecturerPositionController {
  constructor(private lecturerPositionService: LecturerPositionService) {}

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
  ): Promise<LecturerPositionFindAllResponse> {
    const lecturerPositions: LecturerPosition[] = await this.lecturerPositionService.findAll(
      offset,
      limit,
    );
    const currentAmount: number = await this.lecturerPositionService.getLecturerPositionMount();
    const isNext = currentAmount - lecturerPositions.length - offset > 0;

    return {
      statusCode: HttpStatus.OK,
      lecturerPositions,
      isNext,
    };
  }

  @Get(LPO_CONTROLLER_RESOURCE.PATH.SPECIFY)
  public async findById(
    @Param(
      COMMON_PARAMS.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(COMMON_QUERIES_VALUE.FAILED_ID),
      ParseIntPipe,
    )
    id: number,
  ): Promise<LecturerPositionFindByIdResponse> {
    const lecturerPosition: LecturerPosition = await this.lecturerPositionService.findById(
      id,
    );

    return {
      statusCode: HttpStatus.OK,
      lecturerPosition,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Body(new JoiValidationPipe(lecturerPositionCreateValidationSchema))
    lecturePosition: LecturerPosition,
  ): Promise<void> {
    console.log(lecturePosition);
    await this.lecturerPositionService.create(lecturePosition);
  }

  @Patch(LPO_CONTROLLER_RESOURCE.PATH.SPECIFY)
  @HttpCode(HttpStatus.OK)
  public async updateById(
    @Param(
      COMMON_PARAMS.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(COMMON_QUERIES_VALUE.FAILED_ID),
      ParseIntPipe,
    )
    id: number,
    @Body(new JoiValidationPipe(lecturerPositionCreateValidationSchema))
    lecturePosition: LecturerPosition,
  ): Promise<void> {
    await this.lecturerPositionService.updateById(id, lecturePosition);
  }

  @Delete(LPO_CONTROLLER_RESOURCE.PATH.SPECIFY)
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
    await this.lecturerPositionService.deleteById(id);
  }
}
