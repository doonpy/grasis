import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { Payload } from '../../auth/strategies/jwt.strategy';
import { CommonRequest } from '../../common/common.interface';
import { USER_ERROR_RESOURCE } from '../user.resource';

@Injectable()
export class DeleteUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<CommonRequest>();
    const { userId } = request.user as Payload;
    if (!request.params || !request.params.id) {
      return false;
    }

    if (userId === parseInt(request.params.id)) {
      throw new BadRequestException(USER_ERROR_RESOURCE.USER_ERR_6);
    }

    return true;
  }
}
