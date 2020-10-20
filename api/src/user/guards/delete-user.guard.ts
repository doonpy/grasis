import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { Payload } from '../../auth/strategies/jwt.strategy';
import { CommonRequest } from '../../common/common.interface';
import { USER_ERROR_RESOURCE } from '../user.resource';

@Injectable()
export class DeleteUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<CommonRequest>();
    const { userId } = request.user as Payload;
    if (!request.params || !request.params.id) {
      return false;
    }

    this.checkDeleteIsAdmin(userId, parseInt(request.params.id));

    return true;
  }

  private checkDeleteIsAdmin(userId: number, targetId: number): void {
    if (userId === targetId) {
      throw new BadRequestException(USER_ERROR_RESOURCE.ERR_6);
    }
  }
}
