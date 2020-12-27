import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { Connection, EntityManager, Repository } from 'typeorm';

import { CouncilService } from '../council/council.service';
import { ResultService } from '../result/result.service';
import { ThesisState, ThesisStatus } from '../thesis/thesis.resource';
import { ThesisService } from '../thesis/thesis.service';
import { Thesis } from '../thesis/thesis.type';
import { TopicStudentService } from '../topic/topic-student/topic-student.service';
import { TopicService } from '../topic/topic.service';
import { DefenseEntity } from './defense.entity';
import { DefenseError } from './defense.resource';
import { Defense, DefenseForView, DefenseRequestBody } from './defense.type';

@Injectable()
export class DefenseService {
  constructor(
    @InjectRepository(DefenseEntity)
    private readonly defenseRepository: Repository<Defense>,
    @Inject(forwardRef(() => TopicService))
    private readonly topicService: TopicService,
    private readonly topicStudentService: TopicStudentService,
    @Inject(forwardRef(() => ThesisService))
    private readonly thesisService: ThesisService,
    @Inject(forwardRef(() => CouncilService))
    private readonly councilService: CouncilService,
    @Inject(forwardRef(() => ResultService))
    private readonly resultService: ResultService,
    private readonly connection: Connection
  ) {}

  public async createWithTransaction(
    manager: EntityManager,
    data: DefenseRequestBody
  ): Promise<Defense> {
    const entity = manager.create(DefenseEntity, data);

    return manager.save(entity);
  }

  public async getById(id: number): Promise<Defense> {
    const defense = await this.defenseRepository.findOne({
      where: { id },
      cache: true
    });
    if (!defense) {
      throw new BadRequestException(DefenseError.ERR_2);
    }

    return defense;
  }

  public async updateById(id: number, data: DefenseRequestBody, userId: number): Promise<Defense> {
    const currentDefense = await this.getById(id);
    const topic = await this.topicService.getById(id, true);
    await this.topicService.checkPermission(topic, userId);
    if (data.time) {
      await this.checkValidTime(topic.thesis, data.time);
    }

    return this.connection.transaction(async (manager) => {
      if (data.councilId && data.councilId !== currentDefense.councilId) {
        const council = await this.councilService.getById(data.councilId);
        if (topic.creatorId !== council.instructorId) {
          throw new BadRequestException(DefenseError.ERR_1);
        }

        await this.resultService.deleteDefenseResultByTopicId(id);
        const students = await this.topicStudentService.getStudentsParticipated(topic.id);
        for (const student of students) {
          await this.resultService.createDefenseResultWithTransaction(
            manager,
            topic.id,
            student.studentId,
            council
          );
        }
      }

      return manager.save(DefenseEntity, { ...currentDefense, ...data });
    });
  }

  public async deleteByIdWithTransaction(
    manager: EntityManager,
    id: number,
    deletedAt = new Date()
  ): Promise<void> {
    await manager.update(DefenseEntity, { id }, { deletedAt });
  }

  private checkValidTime({ studentTopicRegister, review }: Thesis, time: string | Date): void {
    if (!moment(time).isBetween(studentTopicRegister, review, 'day', '(]')) {
      throw new BadRequestException(DefenseError.ERR_3);
    }
  }

  public async checkUploadReportPermission(topicId: number, userId: number): Promise<void> {
    const topic = await this.topicService.getById(topicId, true);
    await this.topicService.checkPermission(topic, userId);
    if (topic.thesis.status === ThesisStatus.INACTIVE) {
      throw new BadRequestException(DefenseError.ERR_4);
    }

    if (topic.thesis.state !== ThesisState.DEFENSE) {
      throw new BadRequestException(DefenseError.ERR_5);
    }

    await this.topicStudentService.checkParticipatedTopic(topic.id, userId);
  }

  public async getByIds(ids: number[]): Promise<Defense[]> {
    return this.defenseRepository.findByIds(ids, { cache: true });
  }

  public async checkUploadResultPermission(topicId: number, userId: number): Promise<void> {
    const { thesis } = await this.topicService.getById(topicId, true);
    await this.thesisService.checkThesisIsActive(thesis.status);

    if (thesis.state !== ThesisState.DEFENSE) {
      throw new BadRequestException(DefenseError.ERR_5);
    }

    const defense = await this.getById(topicId);
    await this.checkCouncilPermission(defense, userId);
  }

  public async hasCouncilPermission(defenseId: number | Defense, userId: number): Promise<boolean> {
    try {
      let defense: Defense | undefined;
      if (typeof defenseId === 'number') {
        defense = await this.getById(defenseId);
      } else {
        defense = defenseId;
      }

      if (!defense.councilId) {
        return false;
      }

      const { chairmanId, instructorId, commissionerId } = await this.councilService.getById(
        defense.councilId
      );

      return userId === chairmanId || userId === instructorId || userId === commissionerId;
    } catch (error) {
      return false;
    }
  }

  public async checkCouncilPermission(defenseId: number | Defense, userId: number): Promise<void> {
    if (!(await this.hasCouncilPermission(defenseId, userId))) {
      throw new BadRequestException(DefenseError.ERR_6);
    }
  }

  public async convertForView(defense: Defense): Promise<DefenseForView> {
    const participates = await this.topicStudentService.getStudentsParticipated(defense.id);
    const reporters = participates.map(({ student }) => student.convertToFastView());

    return {
      ...defense,
      reporters
    };
  }

  public async getByCouncilId(councilId: number): Promise<Defense[]> {
    return this.defenseRepository.find({
      where: {
        councilId
      },
      cache: true
    });
  }
}
