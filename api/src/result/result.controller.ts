import {
  Body,
  Controller,
  DefaultValuePipe,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UseGuards
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommonParam, CommonQueryValue } from '../common/common.resource';
import { commonIdValidateSchema } from '../common/common.validation';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { ResultPath } from './result.resource';
import { ResultService } from './result.service';
import { ResultChangeResponse, ResultRequestBody } from './result.type';
import { ResultUpdateValidationSchema } from './result.validation';

@UseGuards(JwtAuthGuard)
@Controller(ResultPath.ROOT)
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Patch(ResultPath.SPECIFY)
  @HttpCode(HttpStatus.OK)
  public async updateById(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number,
    @Body(new JoiValidationPipe(ResultUpdateValidationSchema)) body: ResultRequestBody,
    @Req() request: Express.CustomRequest
  ): Promise<ResultChangeResponse> {
    const loginId = request.user!.userId;
    const result = await this.resultService.updateById(id, body, loginId);

    return {
      statusCode: HttpStatus.OK,
      result: await this.resultService.convertForView(result, loginId)
    };
  }
}
