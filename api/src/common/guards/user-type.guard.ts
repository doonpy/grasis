import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { AuthError } from '../../auth/auth.resource';
import { UserService } from '../../user/user.service';

@Injectable()
export class UserTypeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly userService: UserService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const userTypes = this.reflector.get<number[]>('userTypes', context.getHandler());
    if (!userTypes) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      throw new UnauthorizedException(AuthError.ERR_1);
    }

    const { userId } = request.user;

    return this.userService.checkUserTypeById(userId, userTypes);
  }
}
