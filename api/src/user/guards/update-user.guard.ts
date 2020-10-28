import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { AuthError } from '../../auth/auth.resource';
import { IsAdmin, UserError, UserStatus } from '../user.resource';

@Injectable()
export class UpdateUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Express.CustomRequest>();
    if (!request.user) {
      throw new UnauthorizedException(AuthError.ERR_1);
    }

    const { userId } = request.user;
    let isAdmin = NaN;
    let userStatus = NaN;
    let targetId = NaN;
    if (request.body) {
      isAdmin = parseInt(request.body.isAdmin || '');
      userStatus = parseInt(request.body.status || '');
    }

    if (request?.params) {
      targetId = parseInt(request.params.id || '');
    }

    this.checkUpdateIsAdmin(userId, targetId, isAdmin);
    this.checkUpdateStatus(userId, targetId, userStatus);

    return true;
  }

  private checkUpdateIsAdmin(userId: number, targetId: number, isAdmin: IsAdmin): void {
    if (!Number.isNaN(isAdmin) && userId === targetId) {
      throw new BadRequestException(UserError.ERR_8);
    }
  }

  private checkUpdateStatus(userId: number, targetId: number, status: UserStatus): void {
    if (!Number.isNaN(status) && userId === targetId) {
      throw new BadRequestException(UserError.ERR_10);
    }
  }
}
