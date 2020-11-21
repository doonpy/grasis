import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { EntityManager, Repository } from 'typeorm';

import { notDeleteCondition } from '../common/common.resource';
import { CouncilService } from '../council/council.service';
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
    private readonly councilService: CouncilService
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
      where: { ...notDeleteCondition, id },
      cache: true
    });
    if (!defense) {
      throw new BadRequestException(DefenseError.ERR_2);
    }

    return defense;
  }

  public async updateById(id: number, data: DefenseRequestBody): Promise<void> {
    const currentDefense = await this.getById(id);
    const topic = await this.topicService.getById(id);
    const thesis = await this.thesisService.getById(topic.thesisId);
    if (data.time) {
      await this.checkValidTime(thesis, data.time);
    }

    await this.defenseRepository.update({ id }, { ...currentDefense, ...data });
  }

  public async deleteByIdWithTransaction(
    manager: EntityManager,
    id: number,
    deletedAt = new Date()
  ): Promise<void> {
    await manager.update(DefenseEntity, { ...notDeleteCondition, id }, { deletedAt });
  }

  public async getByIdForView(id: number): Promise<DefenseForView> {
    const { createdAt, updatedAt, time, place, note, councilId } = await this.getById(id);
    const participates = await this.topicStudentService.getStudentsParticipated(id);
    const reporters = participates.map(({ student }) => student.convertToFastView());

    return {
      id,
      createdAt,
      updatedAt,
      time,
      place,
      note,
      reporters,
      councilId
    };
  }

  private checkValidTime({ studentTopicRegister, review }: Thesis, time: string | Date): void {
    if (!moment(time).isBetween(studentTopicRegister, review, 'day', '(]')) {
      throw new BadRequestException(DefenseError.ERR_3);
    }
  }

  public async checkDownloadPermission(topicId: number, userId: number): Promise<void> {
    const topic = await this.topicService.getById(topicId);
    await this.topicService.checkPermission(topic, userId);
    if (topic.thesis.status === ThesisStatus.INACTIVE) {
      throw new BadRequestException(DefenseError.ERR_5);
    }
  }

  public async checkUploadReportPermission(topicId: number, userId: number): Promise<void> {
    const topic = await this.topicService.getById(topicId);
    await this.topicService.checkPermission(topic, userId);
    if (topic.thesis.status === ThesisStatus.INACTIVE) {
      throw new BadRequestException(DefenseError.ERR_5);
    }

    if (topic.thesis.state !== ThesisState.DEFENSE) {
      throw new BadRequestException(DefenseError.ERR_6);
    }

    if (!(await this.topicStudentService.hasParticipatedTopic(topic.id, userId))) {
      throw new BadRequestException(DefenseError.ERR_4);
    }
  }

  public async getByIds(ids: number[]): Promise<Defense[]> {
    return this.defenseRepository.findByIds(ids, { where: { ...notDeleteCondition }, cache: true });
  }

  public async checkUploadResultPermission(topicId: number, userId: number): Promise<void> {
    const { thesis } = await this.topicService.getById(topicId);
    if (thesis.status === ThesisStatus.INACTIVE) {
      throw new BadRequestException(DefenseError.ERR_5);
    }

    if (thesis.state !== ThesisState.DEFENSE) {
      throw new BadRequestException(DefenseError.ERR_6);
    }

    const defense = await this.getById(topicId);
    if (!(await this.hasCouncilPermission(defense, userId))) {
      throw new BadRequestException(DefenseError.ERR_7);
    }
  }

  public async hasCouncilPermission(defenseId: number | Defense, userId: number): Promise<boolean> {
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
  }
}
