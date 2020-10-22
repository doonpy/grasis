import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { Payload } from '../../auth/strategies/jwt.strategy';
import { CommonRequest } from '../../common/common.interface';
import { IsAdmin, UserError } from '../user.resource';

@Injectable()
export class UpdateUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<CommonRequest>();
    const { userId } = request.user as Payload;
    let isAdmin = NaN;
    let targetId = NaN;
    if (request.body) {
      isAdmin = parseInt(request.body.isAdmin || '');
    }

    if (request.params) {
      targetId = parseInt(request.params.id || '');
    }

    this.checkUpdateIsAdmin(userId, targetId, isAdmin);

    return true;
  }

  private checkUpdateIsAdmin(userId: number, targetId: number, isAdmin: IsAdmin): void {
    if (!Number.isNaN(isAdmin) && userId === targetId) {
      throw new BadRequestException(UserError.ERR_8);
    }
  }
}
