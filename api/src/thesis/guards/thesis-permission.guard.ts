import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { IsAdmin } from '../../user/user.resource';
import { UserService } from '../../user/user.service';
import { ThesisError } from '../thesis.resource';
import { ThesisService } from '../thesis.service';

@Injectable()
export class ThesisPermissionGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly thesisService: ThesisService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Express.CustomRequest>();
    const { userId } = request.user!;
    let thesisId: number | undefined = undefined;
    if (request.params && request.params.id) {
      thesisId = parseInt(request.params.id);
    }

    if (request.params && request.params.thesisId) {
      thesisId = parseInt(request.params.thesisId);
    }

    if (!thesisId) {
      throw new BadRequestException(ThesisError.ERR_8);
    }

    const loginUser = await this.userService.findById(userId);
    if (loginUser.isAdmin === IsAdmin.TRUE) {
      return true;
    }

    await this.thesisService.checkThesisPermission(thesisId, loginUser);

    return true;
  }
}
