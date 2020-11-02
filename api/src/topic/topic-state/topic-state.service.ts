import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';

import { notDeleteCondition } from '../../common/common.resource';
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

  public async getMany(topicId: number): Promise<TopicState[]> {
    return this.topicStateRepository.find({
      relations: { processor: { user: {} } },
      where: { ...notDeleteCondition, topicId },
      cache: true
    });
  }

  public async deleteByIdsWithTransaction(
    manager: EntityManager,
    ids: number[],
    deletedAt = new Date()
  ): Promise<void> {
    await manager.update(TopicStateEntity, { id: In(ids) }, { deletedAt });
  }
}
