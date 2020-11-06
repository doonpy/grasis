import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { EntityManager, Repository } from 'typeorm';

import { notDeleteCondition } from '../common/common.resource';
import { Thesis } from '../thesis/thesis.interface';
import { TopicStudentService } from '../topic/topic-student/topic-student.service';
import { Topic } from '../topic/topic.interface';
import { TopicService } from '../topic/topic.service';
import { ProgressReportEntity } from './progress-report.entity';
import {
  ProgressReport,
  ProgressReportForView,
  ProgressReportRequestBody
} from './progress-report.interface';
import { ProgressReportError } from './progress-report.resource';

@Injectable()
export class ProgressReportService {
  constructor(
    @InjectRepository(ProgressReportEntity)
    private readonly progressRepository: Repository<ProgressReport>,
    @Inject(forwardRef(() => TopicService))
    private readonly topicService: TopicService,
    private readonly topicStudentService: TopicStudentService
  ) {}

  public async createWithTransaction(
    manager: EntityManager,
    topic: Topic,
    data: ProgressReportRequestBody
  ): Promise<ProgressReport> {
    await this.checkValidTime(topic.thesis, data.time);
    const entity = this.progressRepository.create({ ...data, topic });

    return this.progressRepository.save(entity);
  }

  public async getById(id: number): Promise<ProgressReport> {
    const progressReport = await this.progressRepository.findOne({
      where: { ...notDeleteCondition, id },
      cache: true
    });
    if (!progressReport) {
      throw new BadRequestException(ProgressReportError.ERR_2);
    }

    return progressReport;
  }

  public async getByTopicId(topicId: number): Promise<ProgressReport> {
    const progressReport = await this.progressRepository.findOne(
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

    await this.progressRepository.update({ id }, { ...currentProgressReport, ...data });
  }

  public async deleteById(id: number): Promise<void> {
    const currentProgressReport = await this.getById(id);
    currentProgressReport.deletedAt = new Date();
    await this.progressRepository.save(currentProgressReport);
  }

  public async getByTopicIdForView(topicId: number): Promise<ProgressReportForView> {
    const { createdAt, updatedAt, id, time, place, note } = await this.getByTopicId(topicId);
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
      reporters
    };
  }

  private checkValidTime(
    { studentTopicRegister, progressReport }: Thesis,
    time: string | Date
  ): void {
    if (
      moment(time).isSameOrBefore(studentTopicRegister, 'day') ||
      moment(time).isAfter(progressReport, 'day')
    ) {
      throw new BadRequestException(ProgressReportError.ERR_3);
    }
  }
}
