import { Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { Request as ExRequest } from 'express-serve-static-core';

import { AppService } from './app.service';
import { AuthService, JwtToken } from './auth/auth.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { RefreshService } from './refresh/refresh.service';
import { User } from './user/user.entity';

interface LoginRequest extends ExRequest {
  user: User;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly refreshService: RefreshService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  public async login(@Request() req: Express.Request): Promise<JwtToken> {
    return this.authService.login(req.user as number);
  }

  @Post('/refresh')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async refresh(@Req() req: any): Promise<JwtToken> {
    const userId: number = req.user;
    const oldRefreshToken: string = req.headers['refresh'];
    await this.refreshService.validateRefreshToken(oldRefreshToken);

    return this.authService.login(userId);
  }
}
