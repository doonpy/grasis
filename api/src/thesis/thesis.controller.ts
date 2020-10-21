import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { COMMON_PARAMS, COMMON_QUERIES, COMMON_QUERIES_VALUE } from '../common/common.resource';
import {
  commonIdValidateSchema,
  commonLimitValidateSchema,
  commonOffsetValidateSchema
} from '../common/common.validation';
import { AdminGuard } from '../common/guards/admin.guard';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import {
  Thesis,
  ThesisCreateOrUpdateResponse,
  ThesisGetByIdResponse,
  ThesisGetManyResponse,
  ThesisRequestBody
} from './thesis.interface';
import { THESIS_PATH } from './thesis.resource';
import { ThesisService } from './thesis.service';
import { thesisCreateValidationSchema } from './thesis.validation';

@UseGuards(JwtAuthGuard)
@Controller(THESIS_PATH.ROOT)
export class ThesisController {
  constructor(private readonly thesisService: ThesisService) {}

  @Get()
  public async getMany(
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
  ): Promise<ThesisGetManyResponse> {
    const thesisList: Thesis[] = await this.thesisService.getMany(offset, limit);
    const total: number = await this.thesisService.getAmount();

    return {
      statusCode: HttpStatus.OK,
      thesisList,
      total
    };
  }

  @Post()
  @UseGuards(AdminGuard)
  public async create(
    @Body(new JoiValidationPipe(thesisCreateValidationSchema)) body: ThesisRequestBody
  ): Promise<ThesisCreateOrUpdateResponse> {
    const createdThesis: Thesis = await this.thesisService.create(body);

    return {
      statusCode: HttpStatus.CREATED,
      id: createdThesis.id as number
    };
  }

  @Get(THESIS_PATH.SPECIFY)
  public async getById(
    @Param(
      COMMON_PARAMS.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(COMMON_QUERIES_VALUE.FAILED_ID),
      ParseIntPipe
    )
    id: number
  ): Promise<ThesisGetByIdResponse> {
    const thesis = await this.thesisService.getById(id);

    return { statusCode: HttpStatus.OK, thesis };
  }
}
