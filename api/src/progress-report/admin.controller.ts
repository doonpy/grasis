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
import { CommonParam, CommonQueryValue, RequestDataType } from '../common/common.resource';
import { commonIdValidateSchema } from '../common/common.validation';
import { UseRequestDataType } from '../common/decorators/request-data-type.decorator';
import { AdminGuard } from '../common/guards/admin.guard';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { TopicPermissionGuard } from '../topic/guards/topic-permission.guard';
import { StateResult } from '../topic/topic.resource';
import { stateResultValidationSchema } from '../topic/topic.validation';
import { ProgressReportGuard } from './guards/progress-report.guard';
import { ProgressReportBody, ProgressReportPath } from './progress-report.resource';
import { ProgressReportService } from './progress-report.service';
import {
  ProgressReportCreateOrUpdateResponse,
  ProgressReportRequestBody
} from './progress-report.type';
import { progressReportCreateValidationSchema } from './progress-report.validation';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller(ProgressReportPath.ADMIN_ROOT)
export class ProgressReportAdminController {
  constructor(private readonly progressReportService: ProgressReportService) {}

  @Patch(ProgressReportPath.SPECIFY)
  @UseRequestDataType(RequestDataType.QUERY)
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

  @Post(ProgressReportPath.ADMIN_CHANGE_RESULT)
  @UseRequestDataType(RequestDataType.QUERY)
  @UseGuards(ProgressReportGuard, TopicPermissionGuard)
  public async changeResult(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number,
    @Body(ProgressReportBody.IS_PASSED, new JoiValidationPipe(stateResultValidationSchema))
    result: StateResult
  ): Promise<void> {
    await this.progressReportService.changeResult(id, result);
  }
}
