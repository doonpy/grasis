import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  UseGuards
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express-serve-static-core';

import { AppService } from './app.service';
import { AuthService, JwtToken } from './auth/auth.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { COMMON_PATH } from './common/common.resource';
import { RefreshService } from './refresh/refresh.service';

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
  @Post(COMMON_PATH.LOGIN)
  @HttpCode(HttpStatus.OK)
  public async login(@Request() req: ExpressRequest): Promise<JwtToken> {
    return this.authService.login(req.user as number, req.useragent);
  }

  @Post(COMMON_PATH.REFRESH_TOKEN)
  @HttpCode(HttpStatus.OK)
  public async refresh(@Req() req: ExpressRequest): Promise<JwtToken> {
    const refreshToken = req.headers['refresh'] as string;
    await this.refreshService.validateRefreshToken(refreshToken);
    const { userId } = await this.refreshService.getPayloadFromRefreshToken(refreshToken);

    return this.authService.login(userId, req.useragent);
  }
}
