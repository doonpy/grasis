import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { ThesisError } from '../../thesis/thesis.resource';
import { ThesisService } from '../../thesis/thesis.service';
import { TopicQuery } from '../topic.resource';

@Injectable()
export class ThesisPermissionGuard implements CanActivate {
  constructor(private readonly thesisService: ThesisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Express.CustomRequest>();
    const thesisId: string = request.query![TopicQuery.THESIS_ID];
    if (!thesisId) {
      throw new BadRequestException(ThesisError.ERR_7);
    }

    const { userId } = request.user!;
    await this.thesisService.checkPermission(parseInt(thesisId), userId);

    return true;
  }
}
