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

import { AppService } from './app.service';
import { AuthService, JwtToken } from './auth/auth.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { CommonPath } from './common/common.resource';
import { RefreshService } from './refresh/refresh.service';
import { UploadService } from './upload/upload.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly refreshService: RefreshService,
    private readonly uploadService: UploadService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Post(CommonPath.LOGIN)
  @HttpCode(HttpStatus.OK)
  public async login(@Request() req: Express.CustomRequest): Promise<JwtToken> {
    return this.authService.login(req.user?.userId || NaN, req.useragent);
  }

  @Post(CommonPath.REFRESH_TOKEN)
  @HttpCode(HttpStatus.OK)
  public async refresh(@Req() req: Express.CustomRequest): Promise<JwtToken> {
    const refreshToken = req.headers.refresh || '';
    await this.refreshService.validateRefreshToken(refreshToken);
    const { userId } = await this.refreshService.getPayloadFromRefreshToken(refreshToken);

    return this.authService.login(userId, req.useragent);
  }
}
