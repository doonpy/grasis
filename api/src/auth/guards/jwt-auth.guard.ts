import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  public handleRequest(error: Error | any, userId: number): number | any {
    console.log(userId);
    if (error || !userId) {
      throw error || new UnauthorizedException('Phiên làm việc không hợp lệ.');
    }

    return userId;
  }
}
