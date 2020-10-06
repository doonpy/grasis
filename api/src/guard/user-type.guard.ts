import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class UserTypeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const userTypes = this.reflector.get<number[]>('userTypes', context.getHandler());
    if (!userTypes) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const { user } = request.user;

    if (!userTypes.includes(user.userType)) {
      throw new UnauthorizedException('Bạn không có quyền truy cập tài nguyên này.');
    }

    return true;
  }
}
