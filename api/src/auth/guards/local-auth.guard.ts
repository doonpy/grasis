import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  public handleRequest(error: Error | any, userId: number): number | any {
    if (error || !userId) {
      throw error || new UnauthorizedException('Tài khoản hoặc mật khẩu không chính xác.');
    }

    return userId;
  }
}
