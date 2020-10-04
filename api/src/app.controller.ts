import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { Request as ExRequest } from 'express-serve-static-core';

import { AppService } from './app.service';
import { AuthService, JwtToken } from './auth/auth.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { User } from './user/user.entity';

interface LoginRequest extends ExRequest {
  user: User;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private authService: AuthService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  public async login(@Request() req: LoginRequest): Promise<JwtToken> {
    return this.authService.login(req.user);
  }
}
