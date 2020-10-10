import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { Payload } from '../../auth/strategies/jwt.strategy';
import { UserService } from '../../user/user.service';

@Injectable()
export class UserTypeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly userService: UserService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const userTypes = this.reflector.get<number[]>('userTypes', context.getHandler());
    if (!userTypes) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const { userId } = request.user as Payload;

    return this.userService.checkUserTypeById(userId, userTypes);
  }
}
