import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { CommonColumn } from '../../common/common.resource';
import { UserService } from '../../user/user.service';
import { TopicError } from '../topic.resource';
import { TopicService } from '../topic.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
    private readonly topicService: TopicService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Express.CustomRequest>();
    const topicId: string = request.params![CommonColumn.ID];
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
