import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindConditions, In, Repository } from 'typeorm';

import { DefenseService } from '../defense/defense.service';
import { LecturerService } from '../lecturer/lecturer.service';
import { ReviewService } from '../review/review.service';
import { ThesisState } from '../thesis/thesis.resource';
import { ThesisService } from '../thesis/thesis.service';
import { TopicStudentService } from '../topic/topic-student/topic-student.service';
import { TopicService } from '../topic/topic.service';
import { ResultEntity } from './result.entity';
import {
  RESULT_INSTRUCTOR_INITIAL_DATA,
  RESULT_REVIEW_AND_DEFENSE_INITIAL_DATA,
  ResultError,
  ResultStatus,
  ResultType
} from './result.resource';
import {
  Result,
  ResultForView,
  ResultInitialize,
  ResultOfStudentForView,
  ResultPoint,
  ResultRequestBody
} from './result.type';

@Injectable()
export class ResultService {
  constructor(
    @InjectRepository(ResultEntity) private readonly resultRepository: Repository<Result>,
    @Inject(forwardRef(() => ThesisService))
    private readonly thesisService: ThesisService,
    @Inject(forwardRef(() => TopicService))
    private readonly topicService: TopicService,
    private readonly topicStudentService: TopicStudentService,
    private readonly reviewService: ReviewService,
    private readonly defenseService: DefenseService,
    @Inject(forwardRef(() => LecturerService))
    private readonly lecturerService: LecturerService
  ) {}

  public async createWithTransaction(
    manager: EntityManager,
    data: Partial<Result>
  ): Promise<Result> {
    const entity = manager.create(ResultEntity, data);

    return manager.save(ResultEntity, entity);
  }

  public async isExistedWithConditions(conditions: FindConditions<Result>): Promise<boolean> {
    return (
      (await this.resultRepository.count({
        where: conditions,
        cache: true
      })) > 0
    );
  }

  public async initializeResultWithTransaction(
    manager: EntityManager,
    data: ResultInitialize
  ): Promise<void> {
    const isExisted = await this.isExistedWithConditions({
      topicId: data.topicId,
      studentId: data.studentId,
      creatorId: data.creatorId,
      type: data.type
    });
    if (!isExisted) {
      switch (data.type) {
        case ResultType.INSTRUCTOR:
          data.point = RESULT_INSTRUCTOR_INITIAL_DATA;
          break;
        case ResultType.REVIEW:
        case ResultType.DEFENSE:
          data.point = RESULT_REVIEW_AND_DEFENSE_INITIAL_DATA;
          break;
      }

      await this.createWithTransaction(manager, data);
    }
  }

  public checkEditPermission({ creatorId, status }: Result, userId: number): void {
    if (creatorId !== userId) {
      throw new BadRequestException(ResultError.ERR_4);
    }

    if (status === ResultStatus.LOCK) {
      throw new BadRequestException(ResultError.ERR_2);
    }
  }

  public async getById(id: number): Promise<Result> {
    const result = await this.resultRepository.findOne(id, { cache: true });
    if (!result) {
      throw new BadRequestException(ResultError.ERR_3);
    }

    return result;
  }

  public async updateById(id: number, data: ResultRequestBody, userId: number): Promise<void> {
    const currentResult = await this.getById(id);
    const topic = await this.topicService.getById(currentResult.topicId, true);
    this.thesisService.checkThesisIsActive(topic.thesis.status);
    await this.topicService.checkPermission(topic, userId);
    this.checkStatePermission(topic.thesis.state);
    this.checkEditPermission(currentResult, userId);
    if (data.note) {
      currentResult.note = data.note;
    }

    if (data.point) {
      data.point.forEach((item, index) => {
        if (!currentResult.point || !currentResult.point[index]) {
          return;
        }

        currentResult.point[index].value = item.value;
      });
    }

    currentResult.updatedAt = new Date();
    await this.resultRepository.save(currentResult);
  }

  public async getByIdForView(id: number, userId: number): Promise<ResultForView> {
    const currentResult = await this.getById(id);
    await this.topicService.checkPermission(currentResult.topicId, userId);

    return this.convertForView(currentResult, userId);
  }

  public calculateAverage({ point }: Result): number {
    if (!point) {
      return 0;
    }

    let result = 0;
    point.forEach(({ value, rate }) => {
      if (!value) {
        result += 0;
        return;
      }

      const partialPoint = Math.round(value * (rate / 100) * 100) / 100;
      result = Math.round((result + partialPoint) * 100) / 100;
    });

    return result;
  }

  private async convertForView(result: Result, userId: number): Promise<ResultForView> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { creatorId, studentId, point, ...remain } = result;
    const creator = (await this.lecturerService.getById(creatorId)).convertToFastView();
    const average = this.calculateAverage(result);
    let formattedPoint: ResultPoint[] = [];
    if (point) {
      formattedPoint = point.map((item) => {
        if (creatorId !== userId) {
          item.value = null;
        }

        return item;
      });
    }

    return {
      ...remain,
      creator,
      point: formattedPoint,
      average
    };
  }

  public async getDefenseResultForView(
    topicId: number,
    studentId: number,
    userId: number
  ): Promise<ResultForView[]> {
    await this.topicService.checkPermission(topicId, userId);
    const results = await this.resultRepository.find({
      where: { topicId, studentId, type: ResultType.DEFENSE }
    });

    const resultsForView = [];
    for (const result of results) {
      resultsForView.push(await this.convertForView(result, userId));
    }

    return resultsForView;
  }

  public async getByTopicIdForView(
    topicId: number,
    userId: number
  ): Promise<ResultOfStudentForView[]> {
    const students = await this.topicStudentService.getStudentsParticipated(topicId);
    if (students.length === 0) {
      return [];
    }

    const result: ResultOfStudentForView[] = [];
    for (const { student, studentId } of students) {
      const instructor = await this.resultRepository.findOne({
        where: { topicId, studentId: studentId, type: ResultType.INSTRUCTOR },
        cache: true
      });
      const review = await this.resultRepository.findOne({
        where: { topicId, studentId: studentId, type: ResultType.REVIEW },
        cache: true
      });
      const defenseResult = await this.resultRepository.find({
        where: { topicId, studentId: studentId, type: ResultType.DEFENSE }
      });
      const defenseForView: ResultForView[] = [];
      for (const defense of defenseResult) {
        defenseForView.push(await this.convertForView(defense, userId));
      }
      result.push({
        student: student.convertToFastView(),
        instructor: instructor ? await this.convertForView(instructor, userId) : null,
        review: review ? await this.convertForView(review, userId) : null,
        defense: defenseForView
      });
    }

    return result;
  }

  public checkStatePermission(thesisState: ThesisState): void {
    if (thesisState !== ThesisState.RESULT) {
      throw new BadRequestException(ResultError.ERR_5);
    }
  }

  public async deleteByTopicIdWithTransaction(
    manager: EntityManager,
    topicId: number,
    deletedAt = new Date()
  ): Promise<void> {
    await manager.update(ResultEntity, { topicId }, { deletedAt });
  }

  public async getByStudentIds(topicIds: number[], studentIds: number[]): Promise<Result[]> {
    return this.resultRepository.find({
      where: { studentId: In(studentIds), topicId: In(topicIds) },
      cache: true
    });
  }

  public calculateFinishAverage(results: Result[]): number {
    let instructorResult = 0;
    let reviewResult = 0;
    let councilResult = 0;
    let councilMember = 0;
    results.forEach((result) => {
      switch (result.type) {
        case ResultType.INSTRUCTOR:
          instructorResult =
            Math.round((instructorResult + this.calculateAverage(result)) * 100) / 100;
          break;
        case ResultType.REVIEW:
          reviewResult = Math.round((reviewResult + this.calculateAverage(result)) * 100) / 100;
          break;
        case ResultType.DEFENSE:
          councilResult = Math.round((councilResult + this.calculateAverage(result)) * 100) / 100;
          councilMember++;
          break;
      }
    });
    const total = instructorResult + reviewResult + councilResult / councilMember;

    return Math.round((total / 3) * 100) / 100;
  }
}
