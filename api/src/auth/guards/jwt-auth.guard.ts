import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthError } from '../auth.resource';
import { Payload } from '../strategies/jwt.strategy';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  public handleRequest(error: Error | any, payload: Payload): Payload | any {
    if (error || !payload) {
      throw error || new UnauthorizedException(AuthError.ERR_1);
    }

    return payload;
  }
}
