import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import fs from 'fs';
import mime from 'mime-types';

import { AwsService } from '../aws/aws.service';
import { isProductionMode } from '../common/common.helper';
import { ReportModule, ResultModule } from '../common/common.resource';
import { FileInfo } from '../common/common.type';
import { ProgressReportService } from '../progress-report/progress-report.service';
import { ReviewService } from '../review/review.service';
import { TopicService } from '../topic/topic.service';
import { UserService } from '../user/user.service';
import { UPLOAD_ROOT_FOLDER, UploadDestination, UploadError } from './upload.resource';

@Injectable()
export class UploadService {
  constructor(
    private readonly userService: UserService,
    @Inject(forwardRef(() => ProgressReportService))
    private readonly progressReportService: ProgressReportService,
    private readonly awsService: AwsService,
    private readonly reviewService: ReviewService,
    private readonly topicService: TopicService
  ) {}

  public async checkReportPermission(
    userId: number,
    topicId: number,
    reportModule: ReportModule
  ): Promise<void> {
    switch (reportModule) {
      case ReportModule.PROGRESS_REPORT:
        await this.progressReportService.checkUploadReportPermission(topicId, userId);
        break;
      case ReportModule.REVIEW:
        await this.reviewService.checkUploadReportPermission(topicId, userId);
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
        result += `/${topicId}/${UploadDestination.REVIEW}`;
        break;
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

  public async getReportFiles(
    topicId: number,
    module: ReportModule,
    userId: number
  ): Promise<FileInfo[]> {
    await this.topicService.checkPermission(topicId, userId);
    const folderPath = this.getReportFolderPath(module, topicId);

    return this.getFilesFromPath(folderPath);
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

  public async checkResultPermission(
    userId: number,
    topicId: number,
    resultModule: ResultModule
  ): Promise<void> {
    const user = await this.userService.findById(userId);
    await this.topicService.checkPermission(topicId, user);
    switch (resultModule) {
      case ResultModule.REVIEW:
        await this.reviewService.checkUploadResultPermission(topicId, user);
        break;
      case ResultModule.DEFENSE:
        break;
      default:
        throw new BadRequestException(UploadError.ERR_4);
    }
  }

  public getResultFolderPath(module: ResultModule, topicId: number): string {
    let result = UploadDestination.RESULT_ROOT;
    switch (module) {
      case ResultModule.REVIEW:
        result += `/${topicId}/${UploadDestination.REVIEW}`;
        break;
      case ResultModule.DEFENSE:
    }

    return `${UPLOAD_ROOT_FOLDER}/${result}`;
  }

  public async getResultFiles(
    topicId: number,
    module: ResultModule,
    userId: number
  ): Promise<FileInfo[]> {
    await this.topicService.checkPermission(topicId, userId);
    const folderPath = this.getResultFolderPath(module, topicId);

    return this.getFilesFromPath(folderPath);
  }

  private async getFilesFromPath(folderPath: string): Promise<FileInfo[]> {
    const result: FileInfo[] = [];
    if (folderPath === `${UPLOAD_ROOT_FOLDER}/${UploadDestination.REPORT_ROOT}`) {
      return result;
    }

    if (!fs.existsSync(folderPath)) {
      this.createFolder(folderPath);

      if (isProductionMode()) {
        await this.awsService.downloadFilesFromS3(folderPath);
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
}