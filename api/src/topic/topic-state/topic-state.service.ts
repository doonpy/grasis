import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { TopicStateEntity } from './topic-state.entity';
import { TopicState } from './topic-state.type';

@Injectable()
export class TopicStateService {
  constructor(
    @InjectRepository(TopicStateEntity)
    private readonly topicStateRepository: Repository<TopicState>
  ) {}

  public createEntity(data: Partial<TopicState>): TopicState {
    return this.topicStateRepository.create(data);
  }

  public async getMany(topicId: number): Promise<TopicState[]> {
    return this.topicStateRepository.find({
      relations: ['processor', 'processor.user'],
      where: { topicId },
      cache: true
    });
  }

  public async deleteByTopicIdWithTransaction(
    manager: EntityManager,
    topicId: number,
    deletedAt = new Date()
  ): Promise<void> {
    await manager.update(TopicStateEntity, { topicId }, { deletedAt });
  }
}
