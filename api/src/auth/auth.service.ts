import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { RefreshService } from '../refresh/refresh.service';
import { User } from '../user/user.entity';
import { UserStatus } from '../user/user.resource';
import { UserService } from '../user/user.service';

export interface JwtToken {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly refreshService: RefreshService
  ) {}

  public async validateUser(username: string, inputPassword: string): Promise<number | null> {
    const user: User | undefined = await this.userService.findByUsernameForAuth(username);
    const hashPassword: string = this.userService.hashPassword(inputPassword, username);
    if (user && user.password === hashPassword && user.status === UserStatus.ACTIVE) {
      return user.id;
    }

    return null;
  }

  public async login(userId: number): Promise<JwtToken> {
    const accessToken = this.jwtService.sign({ userId });
    const refreshToken = await this.refreshService.getNewToken(userId);

    return {
      accessToken,
      refreshToken
    };
  }
}
