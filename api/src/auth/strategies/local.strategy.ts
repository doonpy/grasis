import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { User } from '../../user/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  public async validate(username: string, password: string): Promise<any> {
    const user: User | null = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Tên người dùng hoặc mật khẩu không chính xác.');
    }

    return user;
  }
}
