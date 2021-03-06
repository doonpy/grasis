import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { EntityManager, Repository } from 'typeorm';

import { ThesisState } from '../thesis/thesis.resource';
import { ThesisService } from '../thesis/thesis.service';
import { Thesis } from '../thesis/thesis.type';
import { StateResult } from '../topic/topic.resource';
import { TopicService } from '../topic/topic.service';
import { TopicStudentService } from '../topic/topic-student/topic-student.service';
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
    private readonly topicStudentService: TopicStudentService,
    @Inject(forwardRef(() => ThesisService))
    private readonly thesisService: ThesisService
  ) {}

  public async createWithTransaction(
    manager: EntityManager,
    topicId: number,
    data: ProgressReportRequestBody
  ): Promise<ProgressReport> {
    const entity = this.progressReportRepository.create({ ...data, id: topicId });

    return this.progressReportRepository.save(entity);
  }

  public async getById(id: number): Promise<ProgressReport> {
    const progressReport = await this.progressReportRepository.findOne({
      where: { id },
      cache: true
    });
    if (!progressReport) {
      throw new BadRequestException(ProgressReportError.ERR_2);
    }

    return progressReport;
  }

  public async updateById(id: number, data: ProgressReportRequestBody): Promise<ProgressReport> {
    const currentProgressReport = await this.getById(id);
    this.checkResultIsNotDecided(currentProgressReport.result);
    const { thesis } = await this.topicService.getById(id, true);
    if (data.time) {
      await this.checkValidTime(thesis!, data.time);
    }

    return this.progressReportRepository.save({ ...currentProgressReport, ...data });
  }

  public async deleteByTopicIdWithTransaction(
    manager: EntityManager,
    id: number,
    deletedAt = new Date()
  ): Promise<void> {
    await manager.update(ProgressReportEntity, { id }, { deletedAt });
  }

  public async getByIdForView(id: number): Promise<ProgressReportForView> {
    const { createdAt, updatedAt, time, place, note, result } = await this.getById(id);
    const reporters = (
      await this.topicStudentService.getStudentsParticipated(id)
    ).map(({ student }) => student.convertToFastView());

    return {
      createdAt,
      updatedAt,
      id,
      time,
      place,
      note,
      reporters,
      result
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

  public async checkUploadReportPermission(topicId: number, userId: number): Promise<void> {
    const topic = await this.topicService.getById(topicId, true);
    await this.topicService.checkPermission(topic, userId);
    this.thesisService.checkThesisIsActive(topic.thesis!.status);

    if (topic.thesis!.state !== ThesisState.PROGRESS_REPORT) {
      throw new BadRequestException(ProgressReportError.ERR_6);
    }

    await this.topicStudentService.checkParticipatedTopic(topic.id, userId);
    const progressReport = await this.getById(topicId);
    this.checkResultIsNotDecided(progressReport.result);
  }

  public async changeResult(id: number, result: StateResult): Promise<ProgressReport> {
    const progressReview = await this.getById(id);
    this.checkResultIsNotDecided(progressReview.result);

    return this.progressReportRepository.save({ ...progressReview, result });
  }

  public async getByIds(ids: number[]): Promise<ProgressReport[]> {
    return this.progressReportRepository.findByIds(ids, {
      cache: true
    });
  }

  private checkResultIsNotDecided(result: StateResult): void {
    if (result !== StateResult.NOT_DECIDED) {
      throw new BadRequestException(ProgressReportError.ERR_7);
    }
  }

  public async convertForView(progressReport: ProgressReport): Promise<ProgressReportForView> {
    const reporters = (
      await this.topicStudentService.getStudentsParticipated(progressReport.id)
    ).map(({ student }) => student.convertToFastView());

    return {
      ...progressReport,
      reporters
    };
  }

  public async getResult(id: number): Promise<StateResult> {
    const progressReport = await this.progressReportRepository.findOne({
      where: { id },
      cache: true
    });

    if (!progressReport) {
      return StateResult.FAILED;
    }

    return progressReport.result;
  }
}
