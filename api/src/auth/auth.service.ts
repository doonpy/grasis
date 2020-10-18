import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Details } from 'express-useragent';

import { CreateRefresh } from '../refresh/refresh.interface';
import { RefreshService } from '../refresh/refresh.service';
import { UserAuth } from '../user/user.interface';
import { UserStatus } from '../user/user.resource';
import { UserService } from '../user/user.service';
import { JWT_TOKEN_EXPIRE_TIME } from './auth.resource';

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
    const user: UserAuth | undefined = await this.userService.findByUsernameForAuth(username);
    const hashPassword: string = this.userService.hashPassword(inputPassword, username);
    if (user && user.password === hashPassword && user.status === UserStatus.ACTIVE) {
      return user.id;
    }

    return null;
  }

  public async login(userId: number, userAgent?: Details): Promise<JwtToken> {
    const accessToken = this.jwtService.sign(
      { userId },
      { secret: process.env.JWT_SECRET, expiresIn: JWT_TOKEN_EXPIRE_TIME }
    );
    const refreshToken = await this.refreshService.getNewToken(userId);
    if (userAgent) {
      const { browser, version, platform, os, source } = userAgent;
      const createRefresh: CreateRefresh = {
        userId,
        version,
        browser,
        platform,
        os,
        refreshToken,
        source
      };
      await this.refreshService.create(createRefresh);
    }
    await this.refreshService.deleteExpiredToken(userId);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken
    };
  }
}
