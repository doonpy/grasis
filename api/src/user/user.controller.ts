import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommonResponse } from '../common/common.interface';
import { COMMON_PARAMS } from '../common/common.resource';
import { User } from './user.interface';
import { USER_CONTROLLER_RESOURCE } from './user.resource';
import { UserService } from './user.service';

interface FindUserByIdResponse extends CommonResponse {
  user: User;
}

@UseGuards(JwtAuthGuard)
@Controller(USER_CONTROLLER_RESOURCE.PATH.ROOT)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(USER_CONTROLLER_RESOURCE.PATH.SPECIFY)
  public async findUserById(@Param(COMMON_PARAMS.ID) id: number): Promise<FindUserByIdResponse> {
    const user: User = await this.userService.findById(id);

    return {
      statusCode: HttpStatus.OK,
      user
    };
  }
}
