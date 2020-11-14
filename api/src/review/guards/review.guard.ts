import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ThesisState, ThesisStatus } from '../../thesis/thesis.resource';
import { getTopicIdFromRequest } from '../../topic/topic.helper';
import { TopicError } from '../../topic/topic.resource';
import { TopicService } from '../../topic/topic.service';
import { ReviewError } from '../review.resource';

@Injectable()
export class ReviewGuard implements CanActivate {
  constructor(private readonly topicService: TopicService, private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const topicId = getTopicIdFromRequest(context, this.reflector);
    if (!topicId) {
      throw new BadRequestException(TopicError.ERR_5);
    }

    const topic = await this.topicService.getById(topicId);
    if (topic.thesis.status === ThesisStatus.INACTIVE) {
      throw new BadRequestException(ReviewError.ERR_5);
    }

    if (topic.thesis.state !== ThesisState.PROGRESS_REPORT) {
      throw new BadRequestException(ReviewError.ERR_6);
    }

    return true;
  }
}
