import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import fs from 'fs';
import { v4 } from 'uuid';

import { ReportModule } from '../common/common.resource';
import { ProgressReportService } from '../progress-report/progress-report.service';
import { ReviewService } from '../review/review.service';
import { TopicService } from '../topic/topic.service';
import { UploadError } from '../upload/upload.resource';
import { UploadService } from '../upload/upload.service';
import { UserService } from '../user/user.service';
import { DOWNLOAD_ROOT_FOLDER, DownloadError } from './download.resource';

@Injectable()
export class DownloadService {
  constructor(
    private readonly uploadService: UploadService,
    private readonly topicService: TopicService,
    private readonly userService: UserService,
    private readonly progressReportService: ProgressReportService,
    private readonly reviewService: ReviewService
  ) {}

  public removePrefix(filename: string): string {
    return filename.replace(/^.*_/, '');
  }

  public getDownloadPath(fileName: string, sourcePath: string): string {
    const fullSrcPath = `${sourcePath}/${fileName}`;
    this.uploadService.checkFileExist(sourcePath);

    const tempDir = v4();
    const downloadDir = `${DOWNLOAD_ROOT_FOLDER}/${tempDir}`;
    this.createFolder(downloadDir);

    const fullDownloadPath = `${downloadDir}/${fileName}`;
    fs.copyFileSync(fullSrcPath, fullDownloadPath);

    return `${tempDir}/${fileName}`;
  }

  private createFolder(folderPath: string): void {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  }

  public getSourcePath(topicId: number, module: ReportModule): string {
    let path = '';
    switch (module) {
      case ReportModule.PROGRESS_REPORT:
        path = this.uploadService.getReportFolderPath(ReportModule.PROGRESS_REPORT, topicId);
        break;
      case ReportModule.REVIEW:
        path = this.uploadService.getReportFolderPath(ReportModule.REVIEW, topicId);
        break;
      case ReportModule.DEFENSE:
        break;
    }

    return path;
  }

  public deleteTempDir(path: string): void {
    const pathParts = path.split('/');
    pathParts.pop();
    const tempDir = pathParts.join('/');
    fs.rmdir(`${DOWNLOAD_ROOT_FOLDER}/${tempDir}`, { recursive: true }, (error) => {
      if (error) {
        throw new InternalServerErrorException(error);
      }
    });
  }

  public getFilenameFromPath(path: string): string {
    const pathParts = path.split('/');

    return this.removePrefix(pathParts.pop() || '');
  }

  public checkFileExist(filePath: string): void {
    if (!fs.existsSync(`${DOWNLOAD_ROOT_FOLDER}/${filePath}`)) {
      throw new BadRequestException(DownloadError.ERR_1);
    }
  }

  public async checkReportPermission(
    userId: number,
    topicId: number,
    module: ReportModule
  ): Promise<void> {
    switch (module) {
      case ReportModule.PROGRESS_REPORT:
        await this.progressReportService.checkDownloadReportPermission(topicId, userId);
        break;
      case ReportModule.REVIEW:
        await this.reviewService.checkDownloadReportPermission(topicId, userId);
        break;
      case ReportModule.DEFENSE:
        break;
      default:
        throw new BadRequestException(UploadError.ERR_4);
    }
  }
}
