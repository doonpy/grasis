import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { User } from '../../user/user.entity';
import { UserService } from '../../user/user.service';

interface Payload {
  user: User;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET
    });
  }

  public async validate(tokenDecoded: Payload): Promise<Payload | null> {
    if (!(await this.userService.isUserExistById(tokenDecoded.user.id))) {
      return null;
    }

    return tokenDecoded;
  }
}
