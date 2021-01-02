import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { Response } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommonQueryValue, ReportModule, ResultModule } from '../common/common.resource';
import { CommonResponse } from '../common/common.type';
import {
  commonFilenameValidationSchema,
  commonIdValidateSchema
} from '../common/common.validation';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import {
  DOWNLOAD_ROOT_FOLDER,
  DownloadPath,
  DownloadQuery,
  DownloadReportQuery
} from './download.resource';
import { DownloadService } from './download.service';

interface DownloadReportLinkResponse extends CommonResponse {
  path: string;
}

@Controller(DownloadPath.ROOT)
export class DownloadController {
  constructor(private readonly downloadService: DownloadService) {}

  @Get([DownloadPath.REPORT, DownloadPath.RESULT])
  public downloadStateDocument(
    @Query(DownloadQuery.PATH) downloadPath: string,
    @Res() res: Response
  ): void {
    this.downloadService.checkFileExist(downloadPath);
    const filename = this.downloadService.getFilenameFromPath(downloadPath);
    res.download(`${DOWNLOAD_ROOT_FOLDER}/${downloadPath}`, filename);
    this.downloadService.deleteTempDir(downloadPath);
  }

  @Post(DownloadPath.REPORT)
  @UseGuards(JwtAuthGuard)
  public async getDownloadReportLink(
    @Body(
      DownloadReportQuery.TOPIC_ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    topicId: number,
    @Body(
      DownloadReportQuery.MODULE,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    module: ReportModule,
    @Body(DownloadReportQuery.FILE_NAME, new JoiValidationPipe(commonFilenameValidationSchema))
    filename: string,
    @Req() request: Express.CustomRequest
  ): Promise<DownloadReportLinkResponse> {
    const loginUserId = request.user!.userId;
    await this.downloadService.checkDocumentPermission(loginUserId, topicId);
    const sourcePath = this.downloadService.getReportSourcePath(topicId, module);
    const path = this.downloadService.getDownloadPath(filename, sourcePath);

    return { statusCode: HttpStatus.OK, path: path };
  }

  @Post(DownloadPath.RESULT)
  @UseGuards(JwtAuthGuard)
  public async getDownloadResultLink(
    @Body(
      DownloadReportQuery.TOPIC_ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    topicId: number,
    @Body(
      DownloadReportQuery.MODULE,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    module: ResultModule,
    @Body(DownloadReportQuery.FILE_NAME, new JoiValidationPipe(commonFilenameValidationSchema))
    filename: string,
    @Req() request: Express.CustomRequest
  ): Promise<DownloadReportLinkResponse> {
    const loginUserId = request.user!.userId;
    await this.downloadService.checkDocumentPermission(loginUserId, topicId, true);
    const sourcePath = this.downloadService.getResultSourcePath(topicId, module);
    const path = this.downloadService.getDownloadPath(filename, sourcePath);

    return { statusCode: HttpStatus.OK, path: path };
  }
}
