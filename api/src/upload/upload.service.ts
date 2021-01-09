import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import fs from 'fs';
import mime from 'mime-types';

import { AwsService } from '../aws/aws.service';
import { isProductionMode } from '../common/common.helper';
import { ReportModule, ResultModule } from '../common/common.resource';
import { FileInfo } from '../common/common.type';
import { DefenseService } from '../defense/defense.service';
import { ProgressReportService } from '../progress-report/progress-report.service';
import { ReviewService } from '../review/review.service';
import { TopicService } from '../topic/topic.service';
import { UserService } from '../user/user.service';
import { UploadDestination, UploadError } from './upload.resource';

@Injectable()
export class UploadService {
  constructor(
    private readonly userService: UserService,
    @Inject(forwardRef(() => ProgressReportService))
    private readonly progressReportService: ProgressReportService,
    private readonly awsService: AwsService,
    private readonly reviewService: ReviewService,
    private readonly topicService: TopicService,
    private readonly defenseService: DefenseService
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
        await this.defenseService.checkUploadReportPermission(topicId, userId);
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
        result += `/${topicId}/${UploadDestination.DEFENSE}`;
        break;
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
    await this.topicService.checkPermission(topicId, userId);
    switch (resultModule) {
      case ResultModule.REVIEW:
        await this.reviewService.checkUploadResultPermission(topicId, userId);
        break;
      case ResultModule.DEFENSE:
        await this.defenseService.checkUploadResultPermission(topicId, userId);
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
        result += `/${topicId}/${UploadDestination.DEFENSE}`;
        break;
    }

    return result;
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
    if (folderPath === UploadDestination.REPORT_ROOT) {
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

  public convertToFileInfo({ filename, destination }: Express.Multer.File): FileInfo {
    const { size, ctime, mtime } = fs.statSync(`${destination}/${filename}`);

    return { name: filename, size, type: mime.lookup(filename) || '', ctime, mtime };
  }
}
