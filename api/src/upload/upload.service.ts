import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import fs from 'fs';
import mime from 'mime-types';

import { AwsService } from '../aws/aws.service';
import { isProductionMode } from '../common/common.helper';
import { FileInfo } from '../common/common.interface';
import { ReportModule } from '../common/common.resource';
import { ProgressReportService } from '../progress-report/progress-report.service';
import { UserService } from '../user/user.service';
import { UPLOAD_ROOT_FOLDER, UploadDestination, UploadError } from './upload.resource';

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
    reportModule: ReportModule
  ): Promise<void> {
    const user = await this.userService.findById(userId);
    switch (reportModule) {
      case ReportModule.PROGRESS_REPORT:
        await this.progressReportService.checkUploadPermission(topicId, user);
        break;
      case ReportModule.REVIEW:
        break;
      case ReportModule.DEFENSE:
        break;
      default:
        throw new BadRequestException(UploadError.ERR_4);
    }
  }

  public getReportFolderPath(module: ReportModule, topicId: number): string {
    let result = UploadDestination.REPORT_ROOT;
    switch (module) {
      case ReportModule.PROGRESS_REPORT:
        result += `/${topicId}/${UploadDestination.PROGRESS_REPORT}`;
        break;
      case ReportModule.REVIEW:
      case ReportModule.DEFENSE:
    }

    return `${UPLOAD_ROOT_FOLDER}/${result}`;
  }

  public async deleteFileByPath(filePath: string): Promise<void> {
    this.checkFileExist(filePath);
    fs.rmSync(filePath, { force: true });
    if (isProductionMode()) {
      await this.awsService.deleteObjectOnS3(filePath);
    }
  }

  public checkFileExist(filePath: string): void {
    if (!fs.existsSync(`${filePath}`)) {
      throw new BadRequestException(UploadError.ERR_3);
    }
  }

  public async getReportFiles(topicId: number, module: ReportModule): Promise<FileInfo[]> {
    const folderPath = this.getReportFolderPath(module, topicId);
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

  public async uploadToS3(files: Express.Multer.File[]): Promise<void> {
    for (const { path } of files) {
      const fileStream = fs.createReadStream(path);
      await this.awsService.uploadFileToS3(path, fileStream);
    }
  }
}
