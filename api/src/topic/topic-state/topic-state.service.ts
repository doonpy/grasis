import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TopicStateEntity } from './topic-state.entity';
import { TopicState } from './topic-state.interface';

@Injectable()
export class TopicStateService {
  constructor(
    @InjectRepository(TopicStateEntity)
    private readonly topicStateRepository: Repository<TopicState>
  ) {}

  public createEntity(data: Partial<TopicState>): TopicState {
    return this.topicStateRepository.create(data);
  }
}
