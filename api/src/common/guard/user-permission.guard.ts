import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

import { IsAdmin } from '../../user/user.resource';

@Injectable()
export class UserPermissionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user } = request.user;
    const id = request.params.id;
    if (user.isAdmin === IsAdmin.TRUE) {
      return true;
    }

    if (user.id === id) {
      return true;
    }

    throw new UnauthorizedException('Bạn không có quyền thực hiện tác vụ này.');
  }
}
