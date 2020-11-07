import {
  Controller,
  DefaultValuePipe,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import fs from 'fs';
import { diskStorage } from 'multer';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommonResponse } from '../common/common.interface';
import { CommonQueryValue } from '../common/common.resource';
import { commonIdValidateSchema } from '../common/common.validation';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { ProgressReportQuery } from '../progress-report/progress-report.resource';
import { ProgressReportService } from '../progress-report/progress-report.service';
import { UserService } from '../user/user.service';
import {
  avatarFileFilter,
  getAvatarDestination,
  getAvatarFilename,
  getProgressReportDestination,
  getProgressReportFilename,
  progressReportFileFilter
} from './upload.helper';
import {
  UPLOAD_BODY_PROPERTY,
  UPLOAD_TEMP_PREFIX,
  UploadDestination,
  UploadFileSize,
  UploadPath
} from './upload.resource';

@UseGuards(JwtAuthGuard)
@Controller(UploadPath.ROOT)
export class UploadController {
  constructor(
    private readonly userService: UserService,
    private readonly progressReportService: ProgressReportService
  ) {}

  @Post(UploadPath.AVATAR)
  @UseInterceptors(
    FileInterceptor(UPLOAD_BODY_PROPERTY, {
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

  @Post(UploadPath.PROGRESS_REPORT)
  @UseInterceptors(
    FileInterceptor(UPLOAD_BODY_PROPERTY, {
      fileFilter: progressReportFileFilter,
      // limits: { fileSize: UploadFileSize.AVATAR },
      storage: diskStorage({
        destination: getProgressReportDestination,
        filename: getProgressReportFilename
      })
    })
  )
  public async uploadProgressReport(
    @Query(
      ProgressReportQuery.TOPIC_ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    topicId: number,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Express.CustomRequest
  ): Promise<CommonResponse> {
    const filePath = `${UploadDestination.PROGRESS_REPORT}/${topicId}/${file.filename}`;
    try {
      const loginUserId = req.user!.userId;
      const loginUser = await this.userService.findById(loginUserId);
      await this.progressReportService.checkUploadPermission(topicId, loginUser);
      fs.renameSync(filePath, filePath.replace(UPLOAD_TEMP_PREFIX, ''));

      return {
        statusCode: HttpStatus.OK
      };
    } catch (error) {
      fs.rmSync(filePath);
      throw error;
    }
  }
}
