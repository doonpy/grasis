import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { CommonParam } from '../../common/common.resource';
import { ThesisState } from '../../thesis/thesis.resource';
import { ThesisService } from '../../thesis/thesis.service';
import { UserService } from '../../user/user.service';
import { TopicError } from '../topic.resource';
import { TopicService } from '../topic.service';

@Injectable()
export class TopicLecturerRegisterGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly thesisService: ThesisService,
    private readonly topicService: TopicService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Express.CustomRequest>();
    const topicId: string = request.params![CommonParam.ID];
    if (!topicId) {
      throw new BadRequestException(TopicError.ERR_5);
    }

    const topic = await this.topicService.getById(parseInt(topicId));
    const thesis = await this.thesisService.getById(topic.thesisId);
    this.thesisService.checkThesisIsActive(thesis);

    if (thesis.state !== ThesisState.LECTURER_TOPIC_REGISTER) {
      throw new BadRequestException(TopicError.ERR_2);
    }

    return true;
  }
}
