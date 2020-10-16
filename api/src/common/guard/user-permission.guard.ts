import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { Payload } from '../../auth/strategies/jwt.strategy';
import { UserService } from '../../user/user.service';
import { CommonRequest } from '../common.interface';

@Injectable()
export class UserPermissionGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<CommonRequest>();
    const { userId } = request.user as Payload;
    if (!request.params || !request.params.id) {
      return false;
    }

    return this.userService.checkUserHasPermission(userId, parseInt(request.params.id || ''));
  }
}
