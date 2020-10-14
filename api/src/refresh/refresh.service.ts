import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Payload } from '../auth/strategies/jwt.strategy';
import { UserService } from '../user/user.service';

@Injectable()
export class RefreshService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  public async validateRefreshToken(refreshToken: string): Promise<void> {
    let payload: Payload | undefined;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_SECRET
      }) as Payload;
    } catch (error) {
      throw new UnauthorizedException('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.');
    }

    const { userId } = payload;
    if (!(await this.userService.isRefreshTokenExist(userId, refreshToken))) {
      throw new UnauthorizedException('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.');
    }
  }

  public async getNewToken(userId: number): Promise<string> {
    const token = this.jwtService.sign(
      { userId },
      { secret: process.env.REFRESH_SECRET, expiresIn: '1d' }
    );
    await this.userService.updateRefreshToken(userId, token);

    return token;
  }

  public async getPayloadFromRefreshToken(refreshToken: string): Promise<Payload> {
    return this.jwtService.decode(refreshToken) as Payload;
  }
}
