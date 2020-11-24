import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import fs from 'fs';
import { v4 } from 'uuid';

import { ReportModule, ResultModule } from '../common/common.resource';
import { ProgressReportService } from '../progress-report/progress-report.service';
import { ReviewService } from '../review/review.service';
import { ThesisService } from '../thesis/thesis.service';
import { TopicService } from '../topic/topic.service';
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
    private readonly reviewService: ReviewService,
    private readonly thesisService: ThesisService
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

  public getReportSourcePath(topicId: number, module: ReportModule): string {
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

  public getResultSourcePath(topicId: number, module: ResultModule): string {
    let path = '';
    switch (module) {
      case ResultModule.REVIEW:
        path = this.uploadService.getResultFolderPath(ResultModule.REVIEW, topicId);
        break;
      case ResultModule.DEFENSE:
        path = this.uploadService.getResultFolderPath(ResultModule.DEFENSE, topicId);
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

  public async checkDocumentPermission(userId: number, topicId: number): Promise<void> {
    const topic = await this.topicService.getById(topicId, true);
    await this.topicService.checkPermission(topic, userId);
    this.thesisService.checkThesisIsActive(topic.thesis);
  }
}
