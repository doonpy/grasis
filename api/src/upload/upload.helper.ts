import { BadRequestException } from '@nestjs/common';
import fs from 'fs';

import { FileInfo } from '../common/common.interface';
import { FileDestinationCallback, FileFilterCallback, FileNameCallback } from './upload.interface';
import {
  DOWNLOAD_ROOT_FOLDER,
  UPLOAD_ROOT_FOLDER,
  UPLOAD_TEMP_PREFIX,
  UploadDestination,
  UploadError
} from './upload.resource';

function fileFilter(
  validExtensions: string[],
  req: Express.CustomRequest,
  { originalname }: Express.Multer.File,
  callback: FileFilterCallback
): void {
  const validPattern = new RegExp(`.(${validExtensions.join('|')})$`);
  if (!originalname.match(validPattern)) {
    return callback(new BadRequestException(UploadError.ERR_1), false);
  }

  callback(null, true);
}

export function createDestination(path: string): void {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
}

export function getFiles(folderPath: string): FileInfo[] {
  const result: FileInfo[] = [];
  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    const filePath = `${folderPath}/${file}`;
    const { size, ctime, mtime } = fs.statSync(filePath);
    result.push({ name: file, size, ctime, mtime });
  }

  return result;
}

export function checkFileExist(filePath: string): void {
  if (!fs.existsSync(filePath)) {
    throw new BadRequestException(UploadError.ERR_3);
  }
}

export function getDownloadPath(fileName: string, filePath: string): string {
  const fullSrcPath = `${filePath}/${fileName}`;
  checkFileExist(fullSrcPath);
  const downloadPath = filePath.replace(UPLOAD_ROOT_FOLDER, DOWNLOAD_ROOT_FOLDER);
  const fullDownloadPath = `${downloadPath}/${fileName}`;
  createDestination(downloadPath);
  fs.copyFileSync(fullSrcPath, fullDownloadPath);

  return fullDownloadPath.replace(/^\./, '');
}

// AVATAR

export function avatarFileFilter(
  req: Express.CustomRequest,
  file: Express.Multer.File,
  callback: FileFilterCallback
): void {
  const imageExtensions = ['jpg', 'jpeg', 'png'];
  fileFilter(imageExtensions, req, file, callback);
}

export function getAvatarDestination(
  req: Express.CustomRequest,
  file: Express.Multer.File,
  callback: FileDestinationCallback
): void {
  createDestination(UploadDestination.AVATAR);
  callback(null, UploadDestination.AVATAR);
}

export function getAvatarFilename(
  req: Express.CustomRequest | any,
  file: Express.Multer.File,
  callback: FileNameCallback
): void {
  const userId = req.user.userId;
  callback(null, userId.toString());
}

// PROGRESS REPORT

export function progressReportFileFilter(
  req: Express.CustomRequest,
  file: Express.Multer.File,
  callback: FileFilterCallback
): void {
  const imageExtensions = ['doc', 'docx', 'pdf'];
  fileFilter(imageExtensions, req, file, callback);
}

export function getProgressReportDestination(
  req: Express.CustomRequest,
  file: Express.Multer.File,
  callback: FileDestinationCallback
): void {
  const topicId = req.query!.topicId;
  const folderPath = `${UploadDestination.PROGRESS_REPORT}/${topicId}`;
  if (!fs.existsSync(folderPath)) {
    callback(new BadRequestException(UploadError.ERR_2), '');
  }

  callback(null, folderPath);
}

export function getProgressReportFilename(
  req: Express.CustomRequest | any,
  file: Express.Multer.File,
  callback: FileNameCallback
): void {
  callback(null, `${UPLOAD_TEMP_PREFIX}${file.originalname}`);
}
