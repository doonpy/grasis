import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ThesisState, ThesisStatus } from '../thesis/thesis.resource';
import { ThesisService } from '../thesis/thesis.service';
import { IsAdmin } from '../user/user.resource';
import { UserService } from '../user/user.service';
import { NEW_STATE_COMMENT } from './topic-state/topic-state.resource';
import { TopicStateService } from './topic-state/topic-state.service';
import { TopicEntity } from './topic.entity';
import { Topic, TopicRequestBody } from './topic.interface';
import { TopicError } from './topic.resource';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(TopicEntity) private readonly topicRepository: Repository<Topic>,
    private readonly thesisService: ThesisService,
    private readonly userService: UserService,
    private readonly topicStateService: TopicStateService
  ) {}

  public async create(topicBody: TopicRequestBody): Promise<Topic> {
    const { thesisId, approverId, creatorId } = topicBody;
    const loginUser = await this.userService.findById(creatorId);
    await this.thesisService.checkThesisPermission(thesisId, loginUser);

    const thesis = await this.thesisService.getById(thesisId);
    if (thesis.status === ThesisStatus.INACTIVE) {
      throw new BadRequestException(TopicError.ERR_1);
    }

    if (thesis.state !== ThesisState.LECTURER_TOPIC_REGISTER) {
      throw new BadRequestException(TopicError.ERR_2);
    }

    if (!(await this.userService.isUserExistById(approverId))) {
      throw new BadRequestException(TopicError.ERR_4);
    }

    const approver = await this.userService.findById(approverId);
    if (approver.isAdmin !== IsAdmin.TRUE) {
      throw new BadRequestException(TopicError.ERR_3);
    }

    const topicEntity = await this.topicRepository.create(topicBody);
    const newState = this.topicStateService.createEntity({
      topicId: topicEntity.id,
      comment: NEW_STATE_COMMENT
    });
    topicEntity.states = [newState];
    topicEntity.approverId = thesis.creatorId;

    return this.topicRepository.save(topicEntity);
  }
}
