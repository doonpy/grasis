import { BadRequestException } from '@nestjs/common';
import fs from 'fs';

import { UPLOAD_DESTINATION } from './upload.resource';

type FileFilterCallback = (error: Error | null, acceptFile: boolean) => void;
type AvatarDestinationCallback = (error: Error | null, destination: string) => void;
type AvatarFileNameCallback = (error: Error | null, destination: string) => void;

export function avatarFileFilter(
  req: Express.CustomRequest,
  { originalname }: Express.Multer.File,
  callback: FileFilterCallback
): void {
  if (!originalname.match(/\.(jpg|jpeg|png)$/)) {
    return callback(new BadRequestException('Chỉ chấp nhận tệp tin ảnh!'), false);
  }

  callback(null, true);
}

export function getAvatarDestination(
  req: Express.CustomRequest,
  file: Express.Multer.File,
  callback: AvatarDestinationCallback
): void {
  if (!fs.existsSync(UPLOAD_DESTINATION.AVATAR)) {
    fs.mkdirSync(UPLOAD_DESTINATION.AVATAR, { recursive: true });
  }

  callback(null, UPLOAD_DESTINATION.AVATAR);
}

export function getAvatarFilename(
  req: Express.CustomRequest | any,
  file: Express.Multer.File,
  callback: AvatarFileNameCallback
): void {
  const userId = req.user.userId;
  callback(null, userId.toString());
}
