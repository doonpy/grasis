import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthError } from '../auth.resource';
import { AuthService } from '../auth.service';
import { Payload } from './jwt.strategy';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  public async validate(username: string, password: string): Promise<Payload> {
    const payload = await this.authService.validateUser(username, password);
    if (!payload) {
      throw new UnauthorizedException(AuthError.ERR_2);
    }

    return payload;
  }
}
