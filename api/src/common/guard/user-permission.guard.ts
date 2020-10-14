import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { Payload } from '../../auth/strategies/jwt.strategy';
import { UserService } from '../../user/user.service';

@Injectable()
export class UserPermissionGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.user as Payload;
    const targetId = request.params.id;

    return this.userService.checkUserHasPermission(userId, targetId);
  }
}
