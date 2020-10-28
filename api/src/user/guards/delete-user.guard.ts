import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { AuthError } from '../../auth/auth.resource';
import { UserError } from '../user.resource';

@Injectable()
export class DeleteUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Express.Request>();
    if (!request.user) {
      throw new UnauthorizedException(AuthError.ERR_1);
    }

    if (!request.params || !request.params.id) {
      return false;
    }

    const { userId } = request.user;
    this.checkDeleteIsAdmin(userId, parseInt(request.params.id));

    return true;
  }

  private checkDeleteIsAdmin(userId: number, targetId: number): void {
    if (userId === targetId) {
      throw new BadRequestException(UserError.ERR_6);
    }
  }
}
