import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';

import { commonIdValidateSchema } from '../common/common.validation';
import { JoiValidationPipe } from '../pipe/joi-validation.pipe';
import { UserService } from '../user/user.service';
import { AVATAR_CONTROLLER_RESOURCE, AVATAR_DIRECTORY } from './avatar.resource';
import { AvatarService } from './avatar.service';

@Controller(AVATAR_CONTROLLER_RESOURCE.PATH.ROOT)
export class AvatarController {
  constructor(
    private readonly userService: UserService,
    private readonly avatarService: AvatarService
  ) {}

  @Get(AVATAR_CONTROLLER_RESOURCE.PATH.SPECIFY)
  public async getAvatar(
    @Param(AVATAR_CONTROLLER_RESOURCE.PARAM.USER_ID, new JoiValidationPipe(commonIdValidateSchema))
    userId: number,
    @Res() res: Response
  ): Promise<void> {
    await this.userService.checkUserExistById(userId);
    this.avatarService.checkAvatarExist(userId);

    res.sendFile(`${AVATAR_DIRECTORY}/${userId}`, { root: 'files' });
  }
}
