import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { isProductionMode } from '../common/common.helper';
import { CommonQueryValue, ReportModule } from '../common/common.resource';
import { CommonResponse } from '../common/common.type';
import {
  commonIdValidateSchema,
  filenameSchemaValidation,
  reportModuleSchemaValidation
} from '../common/common.validation';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { TopicPermissionGuard } from '../topic/guards/topic-permission.guard';
import { UploadReportInterceptor } from './interceptors/upload-report.interceptor';
import { avatarFileFilter, getAvatarDestination, getAvatarFilename } from './upload.helper';
import { GetReportsResponse } from './upload.type';
import {
  UPLOAD_REPORT_BODY_PROPERTY,
  UploadBody,
  UploadFileSize,
  UploadPath
} from './upload.resource';
import { UploadService } from './upload.service';

@UseGuards(JwtAuthGuard)
@Controller(UploadPath.ROOT)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post(UploadPath.AVATAR)
  @UseInterceptors(
    FileInterceptor(UPLOAD_REPORT_BODY_PROPERTY, {
      fileFilter: avatarFileFilter,
      limits: { fileSize: UploadFileSize.AVATAR },
      storage: diskStorage({
        destination: getAvatarDestination,
        filename: getAvatarFilename
      })
    })
  )
  public uploadAvatar(): CommonResponse {
    return {
      statusCode: HttpStatus.OK
    };
  }

  @Get(UploadPath.REPORT)
  @UseGuards(TopicPermissionGuard)
  public async getManyReport(
    @Query(
      UploadBody.TOPIC_ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    topicId: number,
    @Query(UploadBody.MODULE, new JoiValidationPipe(reportModuleSchemaValidation), ParseIntPipe)
    module: ReportModule
  ): Promise<GetReportsResponse> {
    const reports = await this.uploadService.getReportFiles(topicId, module);

    return {
      statusCode: HttpStatus.OK,
      reports
    };
  }

  @Post(UploadPath.REPORT)
  @UseInterceptors(UploadReportInterceptor)
  public async uploadReport(
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<CommonResponse> {
    if (isProductionMode()) {
      await this.uploadService.uploadToS3(files);
    }

    return {
      statusCode: HttpStatus.OK
    };
  }

  @Post(UploadPath.DELETE_REPORT)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteReport(
    @Body(
      UploadBody.TOPIC_ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    topicId: number,
    @Body(UploadBody.MODULE, new JoiValidationPipe(reportModuleSchemaValidation), ParseIntPipe)
    module: ReportModule,
    @Body(UploadBody.FILENAME, new JoiValidationPipe(filenameSchemaValidation))
    filename: string,
    @Req() request: Express.CustomRequest
  ): Promise<void> {
    const loginUserId = request.user!.userId;
    await this.uploadService.checkPermission(loginUserId, topicId, module);
    const folderPath = this.uploadService.getReportFolderPath(module, topicId);
    await this.uploadService.deleteFileByPath(`${folderPath}/${filename}`);
  }
}
