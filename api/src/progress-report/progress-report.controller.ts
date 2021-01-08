import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  UseGuards
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommonParam, CommonQueryValue } from '../common/common.resource';
import { commonIdValidateSchema } from '../common/common.validation';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { TopicPermissionGuard } from '../topic/guards/topic-permission.guard';
import { ProgressReportPath } from './progress-report.resource';
import { ProgressReportService } from './progress-report.service';
import {
  ProgressReportGetByIdResponse,
  ProgressReportGetResultResponse
} from './progress-report.type';

@UseGuards(JwtAuthGuard, TopicPermissionGuard)
@Controller(ProgressReportPath.ROOT)
export class ProgressReportController {
  constructor(private readonly progressReportService: ProgressReportService) {}

  @Get(ProgressReportPath.SPECIFY)
  public async getById(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number
  ): Promise<ProgressReportGetByIdResponse> {
    const progressReport = await this.progressReportService.getByIdForView(id);

    return {
      statusCode: HttpStatus.OK,
      progressReport
    };
  }

  @Get(ProgressReportPath.GET_RESULT)
  public async getResult(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number
  ): Promise<ProgressReportGetResultResponse> {
    const result = await this.progressReportService.getResult(id);

    return {
      statusCode: HttpStatus.OK,
      result
    };
  }
}
