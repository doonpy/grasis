import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Not, Repository } from 'typeorm';

import { notDeleteCondition } from '../../common/common.resource';
import { TopicError } from '../topic.resource';
import { TopicStudentEntity } from './topic_student.entity';
import { TopicStudent } from './topic-student.interface';
import { TopicStudentStatus } from './topic-student.resouce';

@Injectable()
export class TopicStudentService {
  constructor(
    @InjectRepository(TopicStudentEntity)
    private readonly topicStudentRepository: Repository<TopicStudent>
  ) {}

  public createEntity(data: Partial<TopicStudent>): TopicStudent {
    return this.topicStudentRepository.create(data);
  }

  public async hasRegisteredTopic(topicId: number, studentId: number): Promise<boolean> {
    return (
      (await this.topicStudentRepository.count({
        ...notDeleteCondition,
        topicId,
        studentId,
        status: In([TopicStudentStatus.APPROVED, TopicStudentStatus.PENDING])
      })) > 0
    );
  }

  public async registerTopic(topicId: number, studentId: number): Promise<void> {
    const topicStudent = await this.topicStudentRepository.findOne({
      where: {
        ...notDeleteCondition,
        topicId,
        studentId
      },
      cache: true
    });
    if (!topicStudent) {
      const topicStudentEntity = this.createEntity({
        topicId,
        studentId,
        status: TopicStudentStatus.PENDING
      });
      await this.topicStudentRepository.save(topicStudentEntity);
    } else {
      topicStudent.status = TopicStudentStatus.PENDING;
      topicStudent.createdAt = new Date();
      await this.topicStudentRepository.save(topicStudent);
    }
  }

  public async changeRegisterStatus(
    topicId: number,
    studentId: number,
    status: TopicStudentStatus
  ): Promise<void> {
    await this.topicStudentRepository.update({ topicId, studentId }, { status });
  }

  public async getMany(topicId: number): Promise<TopicStudent[]> {
    return this.topicStudentRepository.find({
      relations: { student: { user: {} }, topic: {} },
      where: { ...notDeleteCondition, topicId },
      cache: true
    });
  }

  public async getOne(topicId: number, studentId: number): Promise<TopicStudent> {
    const topicStudent = await this.topicStudentRepository.findOne({
      where: {
        ...notDeleteCondition,
        topicId,
        studentId
      },
      cache: true
    });
    if (!topicStudent) {
      throw new BadRequestException(TopicError.ERR_12);
    }

    return topicStudent;
  }

  public async hasParticipatedAnotherTopic(topicId: number, studentId: number): Promise<boolean> {
    return (
      (await this.topicStudentRepository.count({
        ...notDeleteCondition,
        topicId: Not(topicId),
        studentId,
        status: TopicStudentStatus.APPROVED
      })) > 0
    );
  }

  public async changeRegisterStatusWithTransaction(
    manager: EntityManager,
    topicId: number,
    studentId: number,
    status: TopicStudentStatus
  ): Promise<void> {
    await manager.update(
      TopicStudentEntity,
      { ...notDeleteCondition, topicId, studentId },
      { status }
    );
  }

  public async rejectAnotherRegisterTopicWithTransaction(
    manager: EntityManager,
    topicIds: number[],
    studentId: number
  ): Promise<void> {
    await manager.update(
      TopicStudentEntity,
      { ...notDeleteCondition, studentId, topicId: In(topicIds) },
      { status: TopicStudentStatus.REJECTED }
    );
  }

  public async deleteByTopicIdsWithTransaction(
    manager: EntityManager,
    topicId: number,
    deletedAt = new Date()
  ): Promise<void> {
    await manager.update(TopicStudentEntity, { topicId }, { deletedAt });
  }
}
