import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import fs from 'fs';
import mime from 'mime-types';

import { AwsService } from '../aws/aws.service';
import { isProductionMode } from '../common/common.helper';
import { FileInfo } from '../common/common.interface';
import { ProgressReportService } from '../progress-report/progress-report.service';
import { UserService } from '../user/user.service';
import {
  DOWNLOAD_ROOT_FOLDER,
  UPLOAD_ROOT_FOLDER,
  UPLOAD_TIME_TO_LIVE,
  UploadDestination,
  UploadError,
  UploadReportModule
} from './upload.resource';

@Injectable()
export class UploadService {
  constructor(
    private readonly userService: UserService,
    @Inject(forwardRef(() => ProgressReportService))
    private readonly progressReportService: ProgressReportService,
    private readonly awsService: AwsService
  ) {}

  public async checkPermission(
    userId: number,
    topicId: number,
    reportModule: UploadReportModule
  ): Promise<void> {
    const user = await this.userService.findById(userId);
    switch (reportModule) {
      case UploadReportModule.PROGRESS_REPORT:
        await this.progressReportService.checkUploadPermission(topicId, user);
        break;
      case UploadReportModule.REVIEW:
        break;
      case UploadReportModule.DEFENSE:
        break;
      default:
        throw new BadRequestException(UploadError.ERR_4);
    }
  }

  public getReportFolderPath(module: UploadReportModule, topicId: number): string {
    let result: string;
    switch (module) {
      case UploadReportModule.PROGRESS_REPORT:
        result = `${UploadDestination.PROGRESS_REPORT}/${topicId}`;
        break;
      case UploadReportModule.REVIEW:
      case UploadReportModule.DEFENSE:
      default:
        result = '';
    }

    return result;
  }

  public async deleteFileByPath(filePath: string): Promise<void> {
    this.checkFileExist(filePath);
    fs.rmSync(filePath, { force: true });
    if (isProductionMode()) {
      await this.awsService.deleteObjectOnS3(filePath);
    }
  }

  public checkFileExist(filePath: string): void {
    if (!fs.existsSync(filePath)) {
      throw new BadRequestException(UploadError.ERR_3);
    }
  }

  public async getReportFiles(folderPath: string): Promise<FileInfo[]> {
    const result: FileInfo[] = [];
    if (!fs.existsSync(folderPath)) {
      this.createFolder(folderPath);

      if (isProductionMode()) {
        await this.awsService.downloadReportFilesFromS3(folderPath);
      }
    }

    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      const filePath = `${folderPath}/${file}`;
      const { size, ctime, mtime } = fs.statSync(filePath);
      result.push({ name: file, size, type: mime.lookup(file) || '', ctime, mtime });
    }

    return result;
  }

  public createFolder(folderPath: string): void {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  }

  public getDownloadPath(fileName: string, filePath: string): string {
    const fullSrcPath = `${filePath}/${fileName}`;
    this.checkFileExist(fullSrcPath);
    const downloadPath = filePath.replace(UPLOAD_ROOT_FOLDER, DOWNLOAD_ROOT_FOLDER);
    const fullDownloadPath = `${downloadPath}/${fileName}`;
    this.createFolder(downloadPath);
    fs.copyFileSync(fullSrcPath, fullDownloadPath);
    setTimeout(() => {
      fs.rmSync(fullDownloadPath, { force: true });
    }, UPLOAD_TIME_TO_LIVE);

    return fullDownloadPath.replace(/^\./, '');
  }

  public async uploadToS3(files: Express.Multer.File[]): Promise<void> {
    for (const { path } of files) {
      const fileStream = fs.createReadStream(path);
      await this.awsService.uploadFileToS3(path, fileStream);
    }
  }
}
