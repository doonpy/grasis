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

import { ResultModule } from '../../common/common.resource';
import {
  filenameSchemaValidation,
  resultModuleSchemaValidation
} from '../../common/common.validation';
import { transformException } from '../multer/multer.util';
import {
  UPLOAD_RESULT_BODY_PROPERTY,
  UPLOAD_RESULT_LIMIT_FILES,
  UploadError,
  UploadFileSize,
  UploadResultMimeTypes
} from '../upload.resource';
import { UploadService } from '../upload.service';
import { FileDestinationCallback, FileNameCallback } from '../upload.type';

@Injectable()
export class UploadResultInterceptor implements NestInterceptor {
  constructor(private readonly uploadService: UploadService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const multerInstance = multer({
      limits: { fileSize: UploadFileSize.REPORT },
      fileFilter: this.fileFilter.bind(this),
      storage: diskStorage({
        filename: this.getFilename.bind(this),
        destination: this.getResultDestination.bind(this)
      })
    });

    await new Promise((resolve, reject) => {
      multerInstance.single(UPLOAD_RESULT_BODY_PROPERTY)(
        ctx.getRequest(),
        ctx.getResponse(),
        (err: any) => {
          if (err) {
            const error = transformException(err);
            return reject(error);
          }
          resolve(true);
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
      const folderPath = this.getFolderPathFromRequest(req);
      this.uploadService.createFolder(folderPath);
      this.checkDestination(folderPath);
    } catch (error) {
      return callback(error);
    }

    if (!UploadResultMimeTypes.includes(mimetype)) {
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

  private getResultDestination(
    req: Express.CustomRequest,
    file: Express.Multer.File,
    callback: FileDestinationCallback
  ): void {
    const folderPath = this.getFolderPathFromRequest(req);
    callback(null, folderPath);
  }

  private async checkPermission(req: Express.CustomRequest): Promise<void> {
    const resultModule: ResultModule = parseInt(req.body!.module);
    const { error } = resultModuleSchemaValidation.validate(resultModule);
    if (error) {
      throw new BadRequestException(error.message);
    }

    const topicId = parseInt(req.body!.topicId);
    const userId = req.user!.userId;
    await this.uploadService.checkResultPermission(userId, topicId, resultModule);
  }

  private checkDestination(folderPath: string): void {
    if (!folderPath || !fs.existsSync(folderPath)) {
      throw new BadRequestException(UploadError.ERR_2);
    }

    const currentFileAmount = fs.readdirSync(folderPath).length;
    if (currentFileAmount + 1 > UPLOAD_RESULT_LIMIT_FILES) {
      throw new BadRequestException(UploadError.ERR_9);
    }
  }

  private getFolderPathFromRequest(req: Express.CustomRequest): string {
    const module: ResultModule = parseInt(req.body!.module);
    const topicId = parseInt(req.body!.topicId);
    return this.uploadService.getResultFolderPath(module, topicId);
  }
}
