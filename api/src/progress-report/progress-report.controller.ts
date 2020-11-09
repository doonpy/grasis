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
import { GenerateDownloadLinkResponse } from '../common/common.interface';
import { CommonQueryValue } from '../common/common.resource';
import {
  commonFilenameValidationSchema,
  commonIdValidateSchema
} from '../common/common.validation';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { TopicPermissionGuard } from '../topic/guards/topic-permission.guard';
import { getDownloadPath } from '../upload/upload.helper';
import { UploadDestination } from '../upload/upload.resource';
import { ProgressReportGuard } from './guards/progress-report.guard';
import { ProgressReportGetByIdResponse } from './progress-report.interface';
import { ProgressReportPath, ProgressReportQuery } from './progress-report.resource';
import { ProgressReportService } from './progress-report.service';

@UseGuards(JwtAuthGuard, TopicPermissionGuard)
@Controller(ProgressReportPath.ROOT)
export class ProgressReportController {
  constructor(private readonly progressReportService: ProgressReportService) {}

  @Get(ProgressReportPath.GET_BY_TOPIC_ID)
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

  @Get(ProgressReportPath.GET_DOCUMENT)
  @UseGuards(ProgressReportGuard)
  public async downloadDoc(
    @Query(
      ProgressReportQuery.TOPIC_ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    topicId: number,
    @Query(ProgressReportQuery.FILE_NAME, new JoiValidationPipe(commonFilenameValidationSchema))
    filename: string
  ): Promise<GenerateDownloadLinkResponse> {
    const path = getDownloadPath(filename, `${UploadDestination.PROGRESS_REPORT}/${topicId}`);

    return { url: path };
  }
}
