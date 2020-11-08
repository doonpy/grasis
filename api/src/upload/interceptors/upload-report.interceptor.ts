import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import fs from 'fs';
import multer, { diskStorage } from 'multer';
import { Observable } from 'rxjs';

import { transformException } from '../multer/multer.util';
import { FileDestinationCallback, FileNameCallback } from '../upload.interface';
import {
  UPLOAD_REPORT_BODY_PROPERTY,
  UPLOAD_REPORT_LIMIT_FILES,
  UploadError,
  UploadReportMimeType,
  UploadReportModule
} from '../upload.resource';
import { UploadService } from '../upload.service';
import {
  uploadFilenameSchemaValidation,
  uploadReportModuleSchemaValidation
} from '../upload.validation';

@Injectable()
export class UploadReportInterceptor implements NestInterceptor {
  constructor(private readonly uploadService: UploadService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const multerInstance = multer({
      fileFilter: this.fileFilter.bind(this),
      storage: diskStorage({
        filename: this.getFilename.bind(this),
        destination: this.getReportDestination.bind(this)
      })
    });

    await new Promise((resolve, reject) =>
      multerInstance.array(UPLOAD_REPORT_BODY_PROPERTY, UPLOAD_REPORT_LIMIT_FILES)(
        ctx.getRequest(),
        ctx.getResponse(),
        (err: any) => {
          if (err) {
            const error = transformException(err);
            return reject(error);
          }
          resolve();
        }
      )
    );

    return next.handle();
  }

  private async fileFilter(
    req: Express.CustomRequest,
    { mimetype }: Express.Multer.File,
    callback: multer.FileFilterCallback
  ): Promise<void> {
    const reportModule: UploadReportModule = parseInt(req.body!.module);
    const { error } = uploadReportModuleSchemaValidation.validate(reportModule);
    if (error) {
      return callback(new BadRequestException(error.message));
    }

    const topicId = parseInt(req.body!.topicId);
    const userId = req.user!.userId;
    try {
      await this.uploadService.checkUploadReportPermission(userId, topicId, reportModule);
    } catch (error) {
      return callback(error);
    }

    if (mimetype !== UploadReportMimeType.WORD && mimetype !== UploadReportMimeType.PDF) {
      return callback(new BadRequestException(UploadError.ERR_1));
    }

    callback(null, true);
  }

  private getFilename(
    req: Express.CustomRequest,
    { originalname }: Express.Multer.File,
    callback: FileNameCallback
  ): void {
    const { error } = uploadFilenameSchemaValidation.validate(originalname);
    if (error) {
      return callback(new BadRequestException(error.message), '');
    }

    callback(null, `${new Date().getTime()}_${originalname}`);
  }

  private getReportDestination(
    req: Express.CustomRequest,
    file: Express.Multer.File,
    callback: FileDestinationCallback
  ): void {
    const module: UploadReportModule = parseInt(req.body!.module);
    const topicId = parseInt(req.body!.topicId);
    const folderPath = this.uploadService.getReportFolderPath(module, topicId);
    if (!folderPath || !fs.existsSync(folderPath)) {
      return callback(new BadRequestException(UploadError.ERR_2), '');
    }

    const currentFileAmount = fs.readdirSync(folderPath).length;
    if (currentFileAmount + 1 > UPLOAD_REPORT_LIMIT_FILES) {
      return callback(new BadRequestException(UploadError.ERR_7), '');
    }

    callback(null, folderPath);
  }
}
