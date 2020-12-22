import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { CommonParam } from '../../common/common.resource';
import { ThesisState } from '../../thesis/thesis.resource';
import { ThesisService } from '../../thesis/thesis.service';
import { TopicError } from '../../topic/topic.resource';
import { TopicService } from '../../topic/topic.service';
import { ReviewError } from '../review.resource';

@Injectable()
export class ReviewGuard implements CanActivate {
  constructor(
    private readonly topicService: TopicService,
    private readonly thesisService: ThesisService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Express.CustomRequest>();
    const topicId: string = request.params![CommonParam.ID];
    if (!topicId) {
      throw new BadRequestException(TopicError.ERR_5);
    }

    const topic = await this.topicService.getById(parseInt(topicId), true);
    this.thesisService.checkThesisIsActive(topic.thesis.status);

    if (topic.thesis.state !== ThesisState.REVIEW) {
      throw new BadRequestException(ReviewError.ERR_6);
    }

    return true;
  }
}
