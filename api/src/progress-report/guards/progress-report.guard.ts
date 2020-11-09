import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { ThesisState, ThesisStatus } from '../../thesis/thesis.resource';
import { TopicError } from '../../topic/topic.resource';
import { TopicService } from '../../topic/topic.service';
import { ProgressReportError, ProgressReportQuery } from '../progress-report.resource';

@Injectable()
export class ProgressReportGuard implements CanActivate {
  constructor(private readonly topicService: TopicService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Express.CustomRequest>();
    const topicId: string = request.query![ProgressReportQuery.TOPIC_ID];
    if (!topicId) {
      throw new BadRequestException(TopicError.ERR_5);
    }

    const topic = await this.topicService.getById(parseInt(topicId));
    if (topic.thesis.status === ThesisStatus.INACTIVE) {
      throw new BadRequestException(ProgressReportError.ERR_5);
    }

    if (topic.thesis.state !== ThesisState.PROGRESS_REPORT) {
      throw new BadRequestException(ProgressReportError.ERR_6);
    }

    return true;
  }
}
