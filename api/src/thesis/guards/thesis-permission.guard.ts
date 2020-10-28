import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthError } from '../../auth/auth.resource';
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
    const request = context.switchToHttp().getRequest<Express.CustomRequest>();
    if (!request.user) {
      throw new UnauthorizedException(AuthError.ERR_1);
    }

    if (!request.params || !request.params.id) {
      return false;
    }

    const { userId } = request.user;
    const thesisId = parseInt(request.params.id);
    const loginUser = await this.userService.findById(userId);

    if (loginUser.isAdmin === IsAdmin.TRUE) {
      return true;
    }

    await this.thesisService.checkThesisPermission(thesisId, loginUser);

    return true;
  }
}
