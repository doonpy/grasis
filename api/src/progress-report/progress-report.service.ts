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
    const entity = this.progressReportRepository.create({ ...data, id: topicId });

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

  public async updateById(id: number, data: ProgressReportRequestBody): Promise<void> {
    const currentProgressReport = await this.getById(id);
    this.checkResultIsNotDecided(currentProgressReport.result);

    const { thesis } = await this.topicService.getById(id);
    if (data.time) {
      await this.checkValidTime(thesis, data.time);
    }

    await this.progressReportRepository.update({ id }, { ...currentProgressReport, ...data });
  }

  public async deleteByTopicIdWithTransaction(
    manager: EntityManager,
    id: number,
    deletedAt = new Date()
  ): Promise<void> {
    await manager.update(ProgressReportEntity, { ...notDeleteCondition, id }, { deletedAt });
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

  public async checkUploadPermission(topicId: number, user: User): Promise<void> {
    const [topic, progressReport] = await Promise.all([
      this.topicService.getById(topicId),
      this.getById(topicId)
    ]);
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

    if (progressReport.result !== StateResult.NOT_DECIDED) {
      throw new BadRequestException(ProgressReportError.ERR_7);
    }
  }

  public async changeResult(id: number, result: StateResult): Promise<void> {
    const progressReview = await this.getById(id);
    this.checkResultIsNotDecided(progressReview.result);

    await this.progressReportRepository.update({ ...notDeleteCondition, id }, { result });
  }

  public async getByIds(ids: number[]): Promise<ProgressReport[]> {
    return this.progressReportRepository.findByIds(ids, {
      where: { ...notDeleteCondition },
      cache: true
    });
  }

  private checkResultIsNotDecided(result: StateResult): void {
    if (result !== StateResult.NOT_DECIDED) {
      throw new BadRequestException(ProgressReportError.ERR_8);
    }
  }
}
