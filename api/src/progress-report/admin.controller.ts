import {
  Body,
  Controller,
  DefaultValuePipe,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommonParam, CommonQueryValue } from '../common/common.resource';
import { commonIdValidateSchema } from '../common/common.validation';
import { AdminGuard } from '../common/guards/admin.guard';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { TopicPermissionGuard } from '../topic/guards/topic-permission.guard';
import { StateResult } from '../topic/topic.resource';
import { stateResultValidationSchema } from '../topic/topic.validation';
import { ProgressReportGuard } from './guards/progress-report.guard';
import { ProgressReportBody, ProgressReportPath } from './progress-report.resource';
import { ProgressReportService } from './progress-report.service';
import { ProgressReportRequestBody, ProgressReportUpdateResponse } from './progress-report.type';
import { progressReportCreateValidationSchema } from './progress-report.validation';

@UseGuards(JwtAuthGuard, AdminGuard, TopicPermissionGuard)
@Controller(ProgressReportPath.ADMIN_ROOT)
export class ProgressReportAdminController {
  constructor(private readonly progressReportService: ProgressReportService) {}

  @Patch(ProgressReportPath.SPECIFY)
  public async updateById(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number,
    @Body(new JoiValidationPipe(progressReportCreateValidationSchema))
    body: ProgressReportRequestBody
  ): Promise<ProgressReportUpdateResponse> {
    const progressReport = await this.progressReportService.updateById(id, body);

    return {
      statusCode: HttpStatus.OK,
      progressReport: await this.progressReportService.convertForView(progressReport)
    };
  }

  @Post(ProgressReportPath.ADMIN_CHANGE_RESULT)
  @UseGuards(ProgressReportGuard)
  public async changeResult(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number,
    @Body(ProgressReportBody.RESULT, new JoiValidationPipe(stateResultValidationSchema))
    result: StateResult
  ): Promise<void> {
    await this.progressReportService.changeResult(id, result);
  }
}
