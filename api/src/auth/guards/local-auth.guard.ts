import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Lecturer } from '../../lecturer/lecturer.entity';
import { User } from '../../user/user.entity';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  public handleRequest(error: Error | any, user: User | Lecturer | any): User | Lecturer | any {
    if (error || !user) {
      throw error || new UnauthorizedException('Tài khoản hoặc mật khẩu không chính xác.');
    }

    return user;
  }
}
