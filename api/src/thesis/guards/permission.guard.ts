import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { CommonColumn } from '../../common/common.resource';
import { UserService } from '../../user/user.service';
import { ThesisError } from '../thesis.resource';
import { ThesisService } from '../thesis.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly thesisService: ThesisService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Express.CustomRequest>();
    const thesisId: string = request.params![CommonColumn.ID];
    if (!thesisId) {
      throw new BadRequestException(ThesisError.ERR_7);
    }

    const { userId } = request.user!;
    const loginUser = await this.userService.findById(userId);
    await this.thesisService.checkThesisPermission(parseInt(thesisId), loginUser);

    return true;
  }
}
