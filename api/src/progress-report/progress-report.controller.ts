import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  ParseIntPipe,
  Query,
  UseGuards
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommonQueryValue, RequestDataType } from '../common/common.resource';
import { commonIdValidateSchema } from '../common/common.validation';
import { UseRequestDataType } from '../common/decorators/request-data-type.decorator';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { TopicPermissionGuard } from '../topic/guards/topic-permission.guard';
import { ProgressReportPath, ProgressReportQuery } from './progress-report.resource';
import { ProgressReportService } from './progress-report.service';
import { ProgressReportGetByIdResponse } from './progress-report.type';

@UseGuards(JwtAuthGuard)
@Controller(ProgressReportPath.ROOT)
export class ProgressReportController {
  constructor(private readonly progressReportService: ProgressReportService) {}

  @Get(ProgressReportPath.GET_BY_TOPIC_ID)
  @UseRequestDataType(RequestDataType.QUERY)
  @UseGuards(TopicPermissionGuard)
  public async getByTopicId(
    @Query(
      ProgressReportQuery.TOPIC_ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    topicId: number
  ): Promise<ProgressReportGetByIdResponse> {
    const progressReport = await this.progressReportService.getByTopicIdForView(topicId);

    return {
      statusCode: HttpStatus.OK,
      progressReport
    };
  }
}
