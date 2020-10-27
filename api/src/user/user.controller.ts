import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommonResponse } from '../common/common.interface';
import { CommonParam } from '../common/common.resource';
import { User } from './user.interface';
import { UserPath } from './user.resource';
import { UserService } from './user.service';

interface FindUserByIdResponse extends CommonResponse {
  user: User;
}

@UseGuards(JwtAuthGuard)
@Controller(UserPath.ROOT)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(UserPath.SPECIFY)
  public async findUserById(@Param(CommonParam.ID) id: number): Promise<FindUserByIdResponse> {
    const user: User = await this.userService.findById(id);

    return {
      statusCode: HttpStatus.OK,
      user
    };
  }
}
