import { BadRequestException } from '@nestjs/common';
import fs from 'fs';

import { UploadDestination, UploadError } from './upload.resource';
import { FileDestinationCallback, FileFilterCallback, FileNameCallback } from './upload.type';

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

export function checkFileExist(filePath: string): void {
  if (!fs.existsSync(filePath)) {
    throw new BadRequestException(UploadError.ERR_3);
  }
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
  createDestination(UploadDestination.AVATAR_ROOT);
  callback(null, UploadDestination.AVATAR_ROOT);
}

export function getAvatarFilename(
  req: Express.CustomRequest | any,
  file: Express.Multer.File,
  callback: FileNameCallback
): void {
  const userId = req.user.userId;
  callback(null, userId.toString());
}
