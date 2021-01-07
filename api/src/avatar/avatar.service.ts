import { Injectable } from '@nestjs/common';
import fs from 'fs';

import { AwsService } from '../aws/aws.service';
import { isProductionMode } from '../common/common.helper';
import { UploadDestination } from '../upload/upload.resource';

@Injectable()
export class AvatarService {
  constructor(private readonly awsService: AwsService) {}

  public async isAvatarExist(userId: number): Promise<boolean> {
    const filePath = `${UploadDestination.AVATAR_ROOT}/${userId}`;
    if (!fs.existsSync(filePath)) {
      if (isProductionMode()) {
        const isExist = await this.awsService.isFileExist(filePath);
        if (isExist) {
          await this.awsService.downloadFileFromS3(filePath);
          return true;
        }
      }

      return false;
    }

    return true;
  }
}
