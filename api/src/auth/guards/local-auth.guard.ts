import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../user/user.model';
import { Lecturer } from '../../lecturer/lecturer.model';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  public handleRequest(error: Error | any, user: User | Lecturer | any): User | Lecturer | any {
    if (error || !user) {
      throw error || new UnauthorizedException('Tài khoản hoặc mật khẩu không chính xác.');
    }

    return user;
  }
}
