import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { TopicError } from '../../topic/topic.resource';
import { TopicService } from '../../topic/topic.service';
import { UserService } from '../../user/user.service';
import { ProgressReportQuery } from '../progress-report.resource';

@Injectable()
export class TopicPermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
    private readonly topicService: TopicService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Express.CustomRequest>();
    const topicId: string = request.query![ProgressReportQuery.TOPIC_ID];
    if (!topicId) {
      throw new BadRequestException(TopicError.ERR_5);
    }

    const { userId } = request.user!;
    const loginUser = await this.userService.findById(userId);
    await this.topicService.checkTopicIsExisted(parseInt(topicId));
    await this.topicService.checkPermission(parseInt(topicId), loginUser);

    return true;
  }
}
