import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../user/user.model';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  public handleRequest(error: Error | any, user: User | any): User | any {
    if (error || !user) {
      throw error || new UnauthorizedException('Phiên làm việc không hợp lệ.');
    }

    return user;
  }
}
