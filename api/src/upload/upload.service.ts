import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import fs from 'fs';
import mime from 'mime-types';

import { FileInfo } from '../common/common.interface';
import { ProgressReportService } from '../progress-report/progress-report.service';
import { UserService } from '../user/user.service';
import { UploadDestination, UploadError, UploadReportModule } from './upload.resource';

@Injectable()
export class UploadService {
  constructor(
    private readonly userService: UserService,
    @Inject(forwardRef(() => ProgressReportService))
    private readonly progressReportService: ProgressReportService
  ) {}

  public async checkUploadReportPermission(
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

  public deleteFileByPath(filePath: string): void {
    this.checkFileExist(filePath);
    fs.rmSync(filePath, { force: true });
  }

  public checkFileExist(filePath: string): void {
    if (!fs.existsSync(filePath)) {
      throw new BadRequestException(UploadError.ERR_3);
    }
  }

  public getFiles(folderPath: string): FileInfo[] {
    const result: FileInfo[] = [];
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      const filePath = `${folderPath}/${file}`;
      const { size, ctime, mtime } = fs.statSync(filePath);
      result.push({ name: file, size, type: mime.lookup(file) || '', ctime, mtime });
    }

    return result;
  }
}
