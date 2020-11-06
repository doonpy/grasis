import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { ThesisError } from '../../thesis/thesis.resource';
import { ThesisService } from '../../thesis/thesis.service';
import { UserService } from '../../user/user.service';
import { TopicQuery } from '../topic.resource';

@Injectable()
export class ThesisPermissionGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly thesisService: ThesisService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Express.CustomRequest>();
    const thesisId: string = request.query![TopicQuery.THESIS_ID];
    if (!thesisId) {
      throw new BadRequestException(ThesisError.ERR_7);
    }

    const { userId } = request.user!;
    const loginUser = await this.userService.findById(userId);
    await this.thesisService.checkThesisPermission(parseInt(thesisId), loginUser);

    return true;
  }
}
