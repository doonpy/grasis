import {
  Body,
  Controller,
  DefaultValuePipe,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommonParam, CommonQueryValue } from '../common/common.resource';
import { commonIdValidateSchema } from '../common/common.validation';
import { AdminGuard } from '../common/guards/admin.guard';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { TopicPermissionGuard } from '../topic/guards/topic-permission.guard';
import {
  ProgressReportCreateOrUpdateResponse,
  ProgressReportRequestBody
} from './progress-report.interface';
import { ProgressReportPath } from './progress-report.resource';
import { ProgressReportService } from './progress-report.service';
import { progressReportCreateValidationSchema } from './progress-report.validation';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller(ProgressReportPath.ADMIN_ROOT)
export class ProgressReportAdminController {
  constructor(private readonly progressReportService: ProgressReportService) {}

  @Patch(ProgressReportPath.SPECIFY)
  @UseGuards(TopicPermissionGuard)
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
  ): Promise<ProgressReportCreateOrUpdateResponse> {
    await this.progressReportService.updateById(id, body);

    return {
      statusCode: HttpStatus.OK,
      id
    };
  }
}
