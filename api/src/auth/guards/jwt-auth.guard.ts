import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Payload } from '../strategies/jwt.strategy';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  public handleRequest(error: Error | any, payload: Payload): Payload | any {
    if (error || !payload) {
      throw error || new UnauthorizedException('Phiên làm việc không hợp lệ.');
    }

    return payload;
  }
}
