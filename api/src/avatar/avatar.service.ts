import { BadRequestException, Injectable } from '@nestjs/common';
import fs from 'fs';

import { AwsService } from '../aws/aws.service';
import { isProductionMode } from '../common/common.helper';
import { UploadDestination } from '../upload/upload.resource';
import { AVATAR_ERROR_RESOURCE } from './avatar.resource';

@Injectable()
export class AvatarService {
  constructor(private readonly awsService: AwsService) {}

  public async checkAvatarExist(userId: number): Promise<void> {
    if (isProductionMode() && !fs.existsSync(UploadDestination.AVATAR)) {
      await this.awsService.downloadFilesFromS3(UploadDestination.AVATAR);
    }

    if (!fs.existsSync(`${UploadDestination.AVATAR}/${userId}`)) {
      throw new BadRequestException(AVATAR_ERROR_RESOURCE.ERR_1);
    }
  }
}
