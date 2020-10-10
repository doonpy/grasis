import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  public async validate(username: string, password: string): Promise<number> {
    const userId: number | null = await this.authService.validateUser(username, password);
    if (!userId) {
      throw new UnauthorizedException('Tên người dùng hoặc mật khẩu không chính xác.');
    }

    return userId;
  }
}
