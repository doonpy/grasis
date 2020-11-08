import { BadRequestException } from '@nestjs/common';
import fs from 'fs';

import { FileDestinationCallback, FileFilterCallback, FileNameCallback } from './upload.interface';
import {
  DOWNLOAD_ROOT_FOLDER,
  UPLOAD_ROOT_FOLDER,
  UPLOAD_TIME_TO_LIVE,
  UploadDestination,
  UploadError
} from './upload.resource';

function fileFilter(
  validExtensions: string[],
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

// export function getFiles(folderPath: string): FileInfo[] {
//   const result: FileInfo[] = [];
//   const files = fs.readdirSync(folderPath);
//   for (const file of files) {
//     const filePath = `${folderPath}/${file}`;
//     const { size, ctime, mtime } = fs.statSync(filePath);
//     result.push({ name: file, size, ctime, mtime });
//   }
//
//   return result;
// }

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
  setTimeout(() => {
    fs.rmSync(fullDownloadPath, { force: true });
  }, UPLOAD_TIME_TO_LIVE);

  return fullDownloadPath.replace(/^\./, '');
}

// AVATAR

export function avatarFileFilter(
  req: Express.CustomRequest,
  file: Express.Multer.File,
  callback: FileFilterCallback
): void {
  const imageExtensions = ['jpg', 'jpeg', 'png'];
  fileFilter(imageExtensions, file, callback);
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
