import { Controller, HttpStatus, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommonResponse } from '../common/common.interface';
import { avatarFileFilter, getAvatarDestination, getAvatarFilename } from './upload.helper';
import { FILE_SIZE, UPLOAD_CONTROLLER_RESOURCE } from './upload.resource';

@UseGuards(JwtAuthGuard)
@Controller(UPLOAD_CONTROLLER_RESOURCE.PATH.ROOT)
export class UploadController {
  @Post(UPLOAD_CONTROLLER_RESOURCE.PATH.AVATAR)
  @UseInterceptors(
    FileInterceptor(UPLOAD_CONTROLLER_RESOURCE.BODY.AVATAR, {
      fileFilter: avatarFileFilter,
      limits: { fileSize: FILE_SIZE.AVATAR },
      storage: diskStorage({
        destination: getAvatarDestination,
        filename: getAvatarFilename
      })
    })
  )
  public uploadAvatar(): CommonResponse {
    return {
      statusCode: HttpStatus.CREATED
    };
  }
}
