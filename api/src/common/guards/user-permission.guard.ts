import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

import { AuthError } from '../../auth/auth.resource';
import { UserService } from '../../user/user.service';

@Injectable()
export class UserPermissionGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Express.CustomRequest>();
    if (!request.user) {
      throw new UnauthorizedException(AuthError.ERR_1);
    }

    const { userId } = request.user!;

    if (!request.params || !request.params.id) {
      return false;
    }

    return this.userService.checkUserHasPermission(userId, parseInt(request.params.id || ''));
  }
}
