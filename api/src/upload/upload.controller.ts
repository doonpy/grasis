import {
  Body,
  Controller,
  DefaultValuePipe,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommonResponse } from '../common/common.interface';
import { CommonQueryValue } from '../common/common.resource';
import { commonIdValidateSchema } from '../common/common.validation';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { UploadReportInterceptor } from './interceptors/upload-report.interceptor';
import { avatarFileFilter, getAvatarDestination, getAvatarFilename } from './upload.helper';
import {
  UPLOAD_REPORT_BODY_PROPERTY,
  UploadBody,
  UploadFileSize,
  UploadPath,
  UploadReportModule
} from './upload.resource';
import { UploadService } from './upload.service';
import {
  uploadFilenameSchemaValidation,
  uploadReportModuleSchemaValidation
} from './upload.validation';

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

  @Post(UploadPath.REPORT)
  @UseInterceptors(UploadReportInterceptor)
  public uploadReport(): CommonResponse {
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
    @Body(
      UploadBody.MODULE,
      new JoiValidationPipe(uploadReportModuleSchemaValidation),
      ParseIntPipe
    )
    module: UploadReportModule,
    @Body(UploadBody.FILENAME, new JoiValidationPipe(uploadFilenameSchemaValidation))
    filename: string,
    @Req() request: Express.CustomRequest
  ): Promise<void> {
    const loginUserId = request.user!.userId;
    await this.uploadService.checkUploadReportPermission(loginUserId, topicId, module);
    const folderPath = this.uploadService.getReportFolderPath(module, topicId);
    this.uploadService.deleteFileByPath(`${folderPath}/${filename}`);
  }
}
