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
  Req,
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
import { ThesisService } from '../thesis/thesis.service';
import { CouncilPath, CouncilQuery } from './council.resource';
import { CouncilService } from './council.service';
import {
  CouncilCreateOrUpdateResponse,
  CouncilForView,
  CouncilGetByIdForViewResponse,
  CouncilGetManyByThesisIdForViewResponse,
  CouncilRequestBody
} from './council.type';
import { councilCreateValidationSchema } from './council.validation';
import { ParseCouncilRequestBodyPipe } from './pipes/parse-council-request-body.pipe';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller(CouncilPath.ADMIN_ROOT)
export class CouncilAdminController {
  constructor(
    private readonly councilService: CouncilService,
    private readonly thesisService: ThesisService
  ) {}

  @Post()
  public async create(
    @Body(new JoiValidationPipe(councilCreateValidationSchema), ParseCouncilRequestBodyPipe)
    body: CouncilRequestBody,
    @Req() request: Express.CustomRequest
  ): Promise<CouncilCreateOrUpdateResponse> {
    const council = await this.councilService.create(body, request.user!.userId);

    return {
      statusCode: HttpStatus.OK,
      council: this.councilService.convertForView(council)
    };
  }

  @Get(CouncilPath.SPECIFY)
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
      council: this.councilService.convertForView(council)
    };
  }

  @Get()
  public async getManyForViewByThesisId(
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
    @Query(
      CouncilQuery.THESIS_ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    thesisId: number,
    @Query(CommonQuery.KEYWORD, new DefaultValuePipe(undefined)) keyword: string,
    @Req() request: Express.CustomRequest
  ): Promise<CouncilGetManyByThesisIdForViewResponse> {
    const councils: CouncilForView[] = await this.councilService.getManyByThesisIdForView(
      offset,
      limit,
      thesisId,
      request.user!.userId,
      keyword
    );
    const total: number = await this.councilService.getAmountByThesisId(thesisId, keyword);

    return {
      statusCode: HttpStatus.OK,
      councils,
      total
    };
  }

  @Patch(CouncilPath.SPECIFY)
  public async updateById(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number,
    @Body(new JoiValidationPipe(councilCreateValidationSchema), ParseCouncilRequestBodyPipe)
    body: CouncilRequestBody,
    @Req() request: Express.CustomRequest
  ): Promise<CouncilCreateOrUpdateResponse> {
    const council = await this.councilService.updateById(id, body, request.user!.userId);

    return {
      statusCode: HttpStatus.OK,
      council: this.councilService.convertForView(council)
    };
  }

  @Delete(CouncilPath.SPECIFY)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteById(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number,
    @Req() request: Express.CustomRequest
  ): Promise<void> {
    await this.councilService.deleteById(id, request.user!.userId);
  }
}
