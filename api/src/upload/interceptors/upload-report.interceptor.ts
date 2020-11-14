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

import { ReportModule } from '../../common/common.resource';
import {
  filenameSchemaValidation,
  reportModuleSchemaValidation
} from '../../common/common.validation';
import { transformException } from '../multer/multer.util';
import {
  UPLOAD_REPORT_BODY_PROPERTY,
  UPLOAD_REPORT_LIMIT_FILES,
  UploadError,
  UploadFileSize,
  UploadReportMimeTypes
} from '../upload.resource';
import { UploadService } from '../upload.service';
import { FileDestinationCallback, FileNameCallback } from '../upload.type';

@Injectable()
export class UploadReportInterceptor implements NestInterceptor {
  constructor(private readonly uploadService: UploadService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const multerInstance = multer({
      limits: { fileSize: UploadFileSize.REPORT },
      fileFilter: this.fileFilter.bind(this),
      storage: diskStorage({
        filename: this.getFilename.bind(this),
        destination: this.getReportDestination.bind(this)
      })
    });

    await new Promise((resolve, reject) => {
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
      );
    });

    return next.handle();
  }

  private async fileFilter(
    req: Express.CustomRequest,
    { mimetype }: Express.Multer.File,
    callback: multer.FileFilterCallback
  ): Promise<void> {
    try {
      await this.checkPermission(req);
    } catch (error) {
      return callback(error);
    }

    if (!UploadReportMimeTypes.includes(mimetype)) {
      return callback(new BadRequestException(UploadError.ERR_1));
    }

    callback(null, true);
  }

  private getFilename(
    req: Express.CustomRequest,
    { originalname }: Express.Multer.File,
    callback: FileNameCallback
  ): void {
    const { error } = filenameSchemaValidation.validate(originalname);
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
    const folderPath = this.getFolderPathFromRequest(req);
    try {
      this.checkDestination(folderPath);
    } catch (error) {
      callback(error, '');
    }

    callback(null, folderPath);
  }

  private async checkPermission(req: Express.CustomRequest): Promise<void> {
    const reportModule: ReportModule = parseInt(req.body!.module);
    const { error } = reportModuleSchemaValidation.validate(reportModule);
    if (error) {
      throw new BadRequestException(error.message);
    }

    const topicId = parseInt(req.body!.topicId);
    const userId = req.user!.userId;
    await this.uploadService.checkPermission(userId, topicId, reportModule);
  }

  private checkDestination(folderPath: string): void {
    if (!folderPath || !fs.existsSync(folderPath)) {
      throw new BadRequestException(UploadError.ERR_2);
    }

    const currentFileAmount = fs.readdirSync(folderPath).length;
    if (currentFileAmount + 1 > UPLOAD_REPORT_LIMIT_FILES) {
      throw new BadRequestException(UploadError.ERR_7);
    }
  }

  private getFolderPathFromRequest(req: Express.CustomRequest): string {
    const module: ReportModule = parseInt(req.body!.module);
    const topicId = parseInt(req.body!.topicId);
    return this.uploadService.getReportFolderPath(module, topicId);
  }
}
