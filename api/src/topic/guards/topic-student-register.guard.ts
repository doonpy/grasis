import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { CommonColumn } from '../../common/common.resource';
import { ThesisError, ThesisState, ThesisStatus } from '../../thesis/thesis.resource';
import { ThesisService } from '../../thesis/thesis.service';
import { UserType } from '../../user/user.resource';
import { UserService } from '../../user/user.service';
import { TopicStudentService } from '../topic-student/topic-student.service';
import { TopicError, TopicQuery } from '../topic.resource';
import { TopicService } from '../topic.service';

@Injectable()
export class TopicStudentRegisterGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly thesisService: ThesisService,
    private readonly topicService: TopicService,
    private readonly topicStudentService: TopicStudentService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Express.CustomRequest>();
    const thesisId: string = request.query![TopicQuery.THESIS_ID];
    if (!thesisId) {
      throw new BadRequestException(ThesisError.ERR_7);
    }

    const topicId = request.params![CommonColumn.ID];
    if (!topicId) {
      throw new BadRequestException(TopicError.ERR_5);
    }

    const thesis = await this.thesisService.getById(parseInt(thesisId));
    if (thesis.status === ThesisStatus.INACTIVE) {
      throw new BadRequestException(TopicError.ERR_1);
    }

    if (thesis.state !== ThesisState.STUDENT_TOPIC_REGISTER) {
      throw new BadRequestException(TopicError.ERR_11);
    }

    const { userId } = request.user!;
    const loginUser = await this.userService.findById(userId);
    if (loginUser.userType === UserType.STUDENT) {
      if (await this.topicStudentService.hasRegisteredTopic(parseInt(topicId), userId)) {
        throw new BadRequestException(TopicError.ERR_10);
      }

      if (await this.topicStudentService.hasParticipatedAnotherTopic(parseInt(topicId), userId)) {
        throw new BadRequestException(TopicError.ERR_15);
      }
    }

    return true;
  }
}
