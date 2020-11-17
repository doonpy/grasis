import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { CommonParam } from '../../common/common.resource';
import { ThesisState, ThesisStatus } from '../../thesis/thesis.resource';
import { ThesisService } from '../../thesis/thesis.service';
import { UserService } from '../../user/user.service';
import { TopicError } from '../topic.resource';
import { TopicService } from '../topic.service';

@Injectable()
export class TopicStudentRegisterGuard implements CanActivate {
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

    const loginUserId = request.user!.userId;
    const topic = await this.topicService.getById(parseInt(topicId));
    await this.topicService.checkPermission(topic, loginUserId);
    const thesis = await this.thesisService.getById(topic.thesisId);
    if (thesis.status === ThesisStatus.INACTIVE) {
      throw new BadRequestException(TopicError.ERR_1);
    }

    if (thesis.state !== ThesisState.STUDENT_TOPIC_REGISTER) {
      throw new BadRequestException(TopicError.ERR_11);
    }

    return true;
  }
}
