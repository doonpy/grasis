import { BadRequestException, Injectable } from '@nestjs/common';
import fs from 'fs';

import { UploadDestination } from '../upload/upload.resource';
import { AVATAR_ERROR_RESOURCE } from './avatar.resource';

@Injectable()
export class AvatarService {
  public checkAvatarExist(userId: number): void {
    if (!fs.existsSync(`${UploadDestination.AVATAR}/${userId}`)) {
      throw new BadRequestException(AVATAR_ERROR_RESOURCE.ERR_1);
    }
  }
}
