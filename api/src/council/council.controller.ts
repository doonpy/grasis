import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommonParam, CommonQuery, CommonQueryValue } from '../common/common.resource';
import { commonIdValidateSchema } from '../common/common.validation';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { ThesisService } from '../thesis/thesis.service';
import { CouncilPath, CouncilQuery } from './council.resource';
import { CouncilService } from './council.service';
import { CouncilGetByIdForViewResponse, CouncilSearchInThesisByNameResponse } from './council.type';
import { TopicPermissionGuard } from './guards/topic-permission.guard';

@UseGuards(JwtAuthGuard)
@Controller(CouncilPath.ROOT)
export class CouncilController {
  constructor(
    private readonly councilService: CouncilService,
    private readonly thesisService: ThesisService
  ) {}

  @Get(CouncilPath.SPECIFY)
  @UseGuards(TopicPermissionGuard)
  public async getByIdForView(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number,
    @Req() request: Express.CustomRequest
  ): Promise<CouncilGetByIdForViewResponse> {
    const council = await this.councilService.getById(id);
    await this.thesisService.checkPermission(council.thesisId, request.user!.userId);

    return {
      statusCode: HttpStatus.OK,
      council: await this.councilService.convertForView(council)
    };
  }

  @Get(CouncilPath.SEARCH_IN_THESIS_BY_NAME)
  public async searchInThesisByName(
    @Param(
      CouncilQuery.THESIS_ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    thesisId: number,
    @Query(CommonQuery.KEYWORD, new DefaultValuePipe('')) keyword: string,
    @Req() request: Express.CustomRequest
  ): Promise<CouncilSearchInThesisByNameResponse> {
    const result = await this.councilService.searchInThesisByName(
      thesisId,
      request.user!.userId,
      keyword
    );

    return {
      statusCode: HttpStatus.OK,
      result
    };
  }
}
