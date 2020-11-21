import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { CommonParam } from '../../common/common.resource';
import { ThesisState, ThesisStatus } from '../../thesis/thesis.resource';
import { TopicError } from '../../topic/topic.resource';
import { TopicService } from '../../topic/topic.service';
import { DefenseError } from '../defense.resource';

@Injectable()
export class DefenseGuard implements CanActivate {
  constructor(private readonly topicService: TopicService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Express.CustomRequest>();
    const topicId: string = request.params![CommonParam.ID];
    if (!topicId) {
      throw new BadRequestException(TopicError.ERR_5);
    }

    const topic = await this.topicService.getById(parseInt(topicId));
    if (topic.thesis.status === ThesisStatus.INACTIVE) {
      throw new BadRequestException(DefenseError.ERR_5);
    }

    if (topic.thesis.state !== ThesisState.DEFENSE) {
      throw new BadRequestException(DefenseError.ERR_6);
    }

    return true;
  }
}
