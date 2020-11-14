import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Details } from 'express-useragent';

import { RefreshService } from '../refresh/refresh.service';
import { CreateRefresh } from '../refresh/refresh.type';
import { UserService } from '../user/user.service';
import { UserAuth } from '../user/user.type';
import { JWT_TOKEN_EXPIRE_TIME } from './auth.resource';
import { Payload } from './strategies/jwt.strategy';

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

  public async validateUser(username: string, inputPassword: string): Promise<Payload | null> {
    const user: UserAuth | undefined = await this.userService.findForAuth(username, inputPassword);
    if (user) {
      return { userId: user.id };
    }

    return null;
  }

  public async login(userId: number, userAgent?: Details | undefined): Promise<JwtToken> {
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
