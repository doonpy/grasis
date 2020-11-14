import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { EntityManager, Repository } from 'typeorm';

import { notDeleteCondition } from '../common/common.resource';
import { ThesisState, ThesisStatus } from '../thesis/thesis.resource';
import { Thesis } from '../thesis/thesis.type';
import { TopicStudentService } from '../topic/topic-student/topic-student.service';
import { StateResult } from '../topic/topic.resource';
import { TopicService } from '../topic/topic.service';
import { UserType } from '../user/user.resource';
import { User } from '../user/user.type';
import { ProgressReportEntity } from './progress-report.entity';
import { ProgressReportError } from './progress-report.resource';
import {
  ProgressReport,
  ProgressReportForView,
  ProgressReportRequestBody
} from './progress-report.type';

@Injectable()
export class ProgressReportService {
  constructor(
    @InjectRepository(ProgressReportEntity)
    private readonly progressReportRepository: Repository<ProgressReport>,
    @Inject(forwardRef(() => TopicService))
    private readonly topicService: TopicService,
    private readonly topicStudentService: TopicStudentService
  ) {}

  public async createWithTransaction(
    manager: EntityManager,
    topicId: number,
    data: ProgressReportRequestBody
  ): Promise<ProgressReport> {
    const entity = this.progressReportRepository.create({ ...data, topicId });

    return this.progressReportRepository.save(entity);
  }

  public async getById(id: number): Promise<ProgressReport> {
    const progressReport = await this.progressReportRepository.findOne({
      where: { ...notDeleteCondition, id },
      cache: true
    });
    if (!progressReport) {
      throw new BadRequestException(ProgressReportError.ERR_2);
    }

    return progressReport;
  }

  public async getByTopicId(topicId: number): Promise<ProgressReport> {
    const progressReport = await this.progressReportRepository.findOne(
      { ...notDeleteCondition, topicId },
      { cache: true }
    );
    if (!progressReport) {
      throw new BadRequestException(ProgressReportError.ERR_2);
    }

    return progressReport;
  }

  public async updateById(id: number, data: ProgressReportRequestBody): Promise<void> {
    const currentProgressReport = await this.getById(id);
    const { thesis } = await this.topicService.getById(currentProgressReport.topicId);
    if (data.time) {
      await this.checkValidTime(thesis, data.time);
    }

    await this.progressReportRepository.update({ id }, { ...currentProgressReport, ...data });
  }

  public async deleteByTopicIdWithTransaction(
    manager: EntityManager,
    topicId: number,
    deletedAt = new Date()
  ): Promise<void> {
    await manager.update(ProgressReportEntity, { ...notDeleteCondition, topicId }, { deletedAt });
  }

  public async getByTopicIdForView(topicId: number): Promise<ProgressReportForView> {
    const { createdAt, updatedAt, id, time, place, note, isPassed } = await this.getByTopicId(
      topicId
    );
    const reporters = (
      await this.topicStudentService.getStudentsParticipated(topicId)
    ).map(({ student }) => student.convertToFastView());

    return {
      createdAt,
      updatedAt,
      id,
      topicId,
      time,
      place,
      note,
      reporters,
      isPassed
    };
  }

  private checkValidTime(
    { studentTopicRegister, progressReport }: Thesis,
    time: string | Date
  ): void {
    if (!moment(time).isBetween(studentTopicRegister, progressReport, 'day', '(]')) {
      throw new BadRequestException(ProgressReportError.ERR_3);
    }
  }

  public async checkUploadPermission(topicId: number, user: User): Promise<void> {
    const topic = await this.topicService.getById(topicId);
    if (topic.thesis.status === ThesisStatus.INACTIVE) {
      throw new BadRequestException(ProgressReportError.ERR_5);
    }

    if (topic.thesis.state !== ThesisState.PROGRESS_REPORT) {
      throw new BadRequestException(ProgressReportError.ERR_6);
    }

    if (
      user.userType !== UserType.STUDENT ||
      !(await this.topicStudentService.hasRegisteredTopic(topicId, user.id))
    ) {
      throw new BadRequestException(ProgressReportError.ERR_4);
    }

    await this.topicService.checkPermission(topicId, user);
  }

  public async changeResult(id: number, result: StateResult): Promise<void> {
    await this.progressReportRepository.update({ ...notDeleteCondition, id }, { isPassed: result });
  }
}
