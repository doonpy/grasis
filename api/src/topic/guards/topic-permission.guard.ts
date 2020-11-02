import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { UserService } from '../../user/user.service';
import { TopicError } from '../topic.resource';
import { TopicService } from '../topic.service';

@Injectable()
export class TopicPermissionGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly topicService: TopicService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Express.CustomRequest>();
    const { userId } = request.user!;
    let id: number | undefined = undefined;
    if (request.params && request.params.id) {
      id = parseInt(request.params.id);
    }

    if (!id) {
      throw new BadRequestException(TopicError.ERR_5);
    }

    const loginUser = await this.userService.findById(userId);
    await this.topicService.checkPermission(id, loginUser);

    return true;
  }
}
