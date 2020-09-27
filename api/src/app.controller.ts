import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { Request as ExRequest } from 'express-serve-static-core';
import { User } from './user/user.model';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthService, JwtToken } from './auth/auth.service';

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
