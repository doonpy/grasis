import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';

import { ThesisStatus } from '../../thesis/thesis.resource';
import { TopicError } from '../topic.resource';
import { TopicStudentEntity } from './topic-student.entity';
import { TopicStudentError, TopicStudentStatus } from './topic-student.resouce';
import { TopicStudent, TopicStudentForView } from './topic-student.type';

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
        topicId,
        studentId,
        status: In([TopicStudentStatus.APPROVED, TopicStudentStatus.PENDING])
      })) > 0
    );
  }

  public async registerTopic(topicId: number, studentId: number): Promise<TopicStudent> {
    const topicStudent = await this.topicStudentRepository.findOne({
      where: {
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

      return this.topicStudentRepository.save(topicStudentEntity);
    } else {
      topicStudent.status = TopicStudentStatus.PENDING;
      topicStudent.createdAt = new Date();

      return this.topicStudentRepository.save(topicStudent);
    }
  }

  public async changeRegisterStatus(
    topicId: number,
    studentId: number,
    status: TopicStudentStatus
  ): Promise<void> {
    await this.topicStudentRepository.update({ topicId, studentId }, { status });
  }

  public async getMany(topicId: number, limit: number, offset: number): Promise<TopicStudent[]> {
    return this.topicStudentRepository.find({
      relations: ['student', 'student.user'],
      where: { topicId },
      cache: true,
      take: limit,
      skip: offset
    });
  }

  public async getOne(topicId: number, studentId: number): Promise<TopicStudent> {
    const topicStudent = await this.topicStudentRepository.findOne({
      where: {
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

  public async hasParticipatedAnotherTopic(
    topicIds: number[],
    studentId: number
  ): Promise<boolean> {
    return (
      (await this.topicStudentRepository.count({
        topicId: In(topicIds),
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
    await manager.update(TopicStudentEntity, { topicId, studentId }, { status });
  }

  public async rejectRegisterOfStudentByTopicIdsWithTransaction(
    manager: EntityManager,
    topicIds: number[],
    studentId: number
  ): Promise<void> {
    if (topicIds.length === 0) {
      return;
    }

    await manager.update(
      TopicStudentEntity,
      { studentId, topicId: In(topicIds) },
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

  public async rejectRegisterByTopicIdsWithTransaction(
    manager: EntityManager,
    topicIds: number[]
  ): Promise<void> {
    if (topicIds.length === 0) {
      return;
    }

    await manager.update(
      TopicStudentEntity,
      { topicId: In(topicIds), status: TopicStudentStatus.PENDING },
      { status: TopicStudentStatus.REJECTED }
    );
  }

  public async getStudentsParticipated(topicId: number): Promise<TopicStudent[]> {
    return this.topicStudentRepository.find({
      relations: ['student', 'student.user'],
      where: { topicId, status: TopicStudentStatus.APPROVED },
      cache: true
    });
  }

  public async hasParticipatedTopic(topicId: number, studentId: number): Promise<boolean> {
    return (
      (await this.topicStudentRepository.count({
        topicId,
        studentId,
        status: TopicStudentStatus.APPROVED
      })) > 0
    );
  }

  public async getParticipatingTopics(studentId: number): Promise<TopicStudent[]> {
    return this.topicStudentRepository.find({
      where: {
        studentId,
        status: TopicStudentStatus.APPROVED,
        topic: { thesis: { status: ThesisStatus.ACTIVE } }
      },
      cache: true
    });
  }

  public async checkParticipatedTopic(topicId: number, studentId: number): Promise<void> {
    if (!(await this.hasParticipatedTopic(topicId, studentId))) {
      throw new BadRequestException(TopicStudentError.ERR_1);
    }
  }

  public convertForView({
    topicId,
    status,
    updatedAt,
    student: {
      id,
      studentId,
      user: { firstname, lastname, deletedAt }
    }
  }: TopicStudent): TopicStudentForView {
    return {
      id,
      topicId,
      studentId,
      firstname,
      lastname,
      status,
      deletedAt,
      updatedAt
    };
  }
}
