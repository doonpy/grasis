import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { ThesisError, ThesisState, ThesisStatus } from '../../thesis/thesis.resource';
import { ThesisService } from '../../thesis/thesis.service';
import { UserService } from '../../user/user.service';
import { TopicError, TopicQuery } from '../topic.resource';

@Injectable()
export class TopicLecturerRegisterGuard implements CanActivate {
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

    const thesis = await this.thesisService.getById(parseInt(thesisId));
    if (thesis.status === ThesisStatus.INACTIVE) {
      throw new BadRequestException(TopicError.ERR_1);
    }

    if (thesis.state !== ThesisState.LECTURER_TOPIC_REGISTER) {
      throw new BadRequestException(TopicError.ERR_2);
    }

    return true;
  }
}
