import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { CommonColumn } from '../../common/common.resource';
import { ThesisError } from '../thesis.resource';
import { ThesisService } from '../thesis.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly thesisService: ThesisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Express.CustomRequest>();
    const thesisId: string = request.params![CommonColumn.ID];
    if (!thesisId) {
      throw new BadRequestException(ThesisError.ERR_7);
    }

    const { userId } = request.user!;
    await this.thesisService.checkPermission(parseInt(thesisId), userId);

    return true;
  }
}
