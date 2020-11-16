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
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { isProductionMode } from '../common/common.helper';
import { CommonQueryValue, ReportModule, ResultModule } from '../common/common.resource';
import { CommonResponse } from '../common/common.type';
import {
  commonIdValidateSchema,
  filenameSchemaValidation,
  reportModuleSchemaValidation
} from '../common/common.validation';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { UploadReportInterceptor } from './interceptors/upload-report.interceptor';
import { UploadResultInterceptor } from './interceptors/upload-result.interceptor';
import { avatarFileFilter, getAvatarDestination, getAvatarFilename } from './upload.helper';
import {
  UPLOAD_REPORT_BODY_PROPERTY,
  UploadBody,
  UploadFileSize,
  UploadPath
} from './upload.resource';
import { UploadService } from './upload.service';
import { GetReportsResponse } from './upload.type';

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
  public async getManyReport(
    @Query(
      UploadBody.TOPIC_ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    topicId: number,
    @Query(UploadBody.MODULE, new JoiValidationPipe(reportModuleSchemaValidation), ParseIntPipe)
    module: ReportModule,
    @Req() request: Express.CustomRequest
  ): Promise<GetReportsResponse> {
    const loginUserId = request.user!.userId;
    const reports = await this.uploadService.getReportFiles(topicId, module, loginUserId);

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
    await this.uploadService.checkReportPermission(loginUserId, topicId, module);
    const folderPath = this.uploadService.getReportFolderPath(module, topicId);
    await this.uploadService.deleteFileByPath(`${folderPath}/${filename}`);
  }

  @Post(UploadPath.RESULT)
  @UseInterceptors(UploadResultInterceptor)
  public async uploadResult(@UploadedFile() file: Express.Multer.File): Promise<CommonResponse> {
    if (isProductionMode()) {
      await this.uploadService.uploadToS3([file]);
    }

    return {
      statusCode: HttpStatus.OK
    };
  }

  @Post(UploadPath.DELETE_RESULT)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteResult(
    @Body(
      UploadBody.TOPIC_ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    topicId: number,
    @Body(UploadBody.MODULE, new JoiValidationPipe(reportModuleSchemaValidation), ParseIntPipe)
    module: ResultModule,
    @Body(UploadBody.FILENAME, new JoiValidationPipe(filenameSchemaValidation))
    filename: string,
    @Req() request: Express.CustomRequest
  ): Promise<void> {
    const loginUserId = request.user!.userId;
    await this.uploadService.checkResultPermission(loginUserId, topicId, module);
    const folderPath = this.uploadService.getResultFolderPath(module, topicId);
    await this.uploadService.deleteFileByPath(`${folderPath}/${filename}`);
  }
}
