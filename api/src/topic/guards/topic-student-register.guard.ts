import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { ThesisError, ThesisState, ThesisStatus } from '../../thesis/thesis.resource';
import { ThesisService } from '../../thesis/thesis.service';
import { UserService } from '../../user/user.service';
import { TopicError } from '../topic.resource';

@Injectable()
export class TopicStudentRegisterGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly thesisService: ThesisService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Express.CustomRequest>();
    const { thesisId } = request.params!;

    if (!thesisId) {
      throw new BadRequestException(ThesisError.ERR_7);
    }

    const thesis = await this.thesisService.getById(parseInt(thesisId));
    if (thesis.status === ThesisStatus.INACTIVE) {
      throw new BadRequestException(TopicError.ERR_1);
    }

    if (thesis.state !== ThesisState.STUDENT_TOPIC_REGISTER) {
      throw new BadRequestException(TopicError.ERR_11);
    }

    return true;
  }
}
