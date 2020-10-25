import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Payload } from '../../auth/strategies/jwt.strategy';
import { CommonRequest } from '../../common/common.interface';
import { IsAdmin } from '../../user/user.resource';
import { UserService } from '../../user/user.service';
import { ThesisService } from '../thesis.service';

@Injectable()
export class ThesisPermissionGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly thesisService: ThesisService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<CommonRequest>();
    const { userId } = request.user as Payload;
    if (!request.params || !request.params.id) {
      return false;
    }

    const thesisId = parseInt(request.params.id);
    const loginUser = await this.userService.findById(userId);

    if (loginUser.isAdmin === IsAdmin.TRUE) {
      return true;
    }

    await this.thesisService.checkThesisPermission(thesisId, loginUser);

    return true;
  }
}
