import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

import { IsAdmin } from '../../user/user.resource';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user } = request.user;

    if (user.isAdmin !== IsAdmin.TRUE) {
      throw new UnauthorizedException('Bạn không có quyền truy cập tài nguyên này.');
    }

    return true;
  }
}
