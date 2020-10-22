import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
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
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { Thesis, ThesisGetByIdResponse, ThesisGetManyResponse } from './thesis.interface';
import { ThesisPath } from './thesis.resource';
import { ThesisService } from './thesis.service';

@UseGuards(JwtAuthGuard)
@Controller(ThesisPath.ROOT)
export class ThesisController {
  constructor(private readonly thesisService: ThesisService) {}

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

  @Get(ThesisPath.SPECIFY)
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

    return { statusCode: HttpStatus.OK, thesis };
  }
}
