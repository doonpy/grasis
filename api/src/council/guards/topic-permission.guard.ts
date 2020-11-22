import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { TopicError } from '../../topic/topic.resource';
import { TopicService } from '../../topic/topic.service';
import { UserService } from '../../user/user.service';
import { CouncilQuery } from '../council.resource';

@Injectable()
export class TopicPermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
    private readonly topicService: TopicService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Express.CustomRequest>();
    const topicId: string = request.query![CouncilQuery.TOPIC_ID];
    if (!topicId) {
      throw new BadRequestException(TopicError.ERR_5);
    }

    const loginUserId = request.user!.userId;
    await this.topicService.checkPermission(parseInt(topicId), loginUserId);

    return true;
  }
}
