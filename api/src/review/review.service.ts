import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { EntityManager, Repository } from 'typeorm';

import { notDeleteCondition } from '../common/common.resource';
import { LecturerService } from '../lecturer/lecturer.service';
import { LecturerForFastView } from '../lecturer/lecturer.type';
import { ThesisState } from '../thesis/thesis.resource';
import { ThesisService } from '../thesis/thesis.service';
import { Thesis } from '../thesis/thesis.type';
import { TopicStudentService } from '../topic/topic-student/topic-student.service';
import { StateResult } from '../topic/topic.resource';
import { TopicService } from '../topic/topic.service';
import { UserService } from '../user/user.service';
import { ReviewEntity } from './review.entity';
import { ReviewError } from './review.resource';
import {
  Review,
  ReviewChangeResultRequestBody,
  ReviewForView,
  ReviewRequestBody
} from './review.type';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<Review>,
    @Inject(forwardRef(() => TopicService))
    private readonly topicService: TopicService,
    private readonly topicStudentService: TopicStudentService,
    @Inject(forwardRef(() => ThesisService))
    private readonly thesisService: ThesisService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => LecturerService))
    private readonly lecturerService: LecturerService
  ) {}

  public async createWithTransaction(
    manager: EntityManager,
    data: ReviewRequestBody
  ): Promise<Review> {
    const entity = manager.create(ReviewEntity, data);

    return manager.save(entity);
  }

  public async getById(id: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { ...notDeleteCondition, id },
      cache: true
    });
    if (!review) {
      throw new BadRequestException(ReviewError.ERR_2);
    }

    return review;
  }

  public async updateById(id: number, data: ReviewRequestBody): Promise<void> {
    const currentReview = await this.getById(id);
    this.checkResultIsNotDecided(currentReview.result);
    const topic = await this.topicService.getById(id);
    const thesis = await this.thesisService.getById(topic.thesisId);
    if (data.time) {
      await this.checkValidTime(thesis, data.time);
    }

    await this.reviewRepository.update({ id }, { ...currentReview, ...data });
  }

  public async deleteByIdWithTransaction(
    manager: EntityManager,
    id: number,
    deletedAt = new Date()
  ): Promise<void> {
    await manager.update(ReviewEntity, { ...notDeleteCondition, id }, { deletedAt });
  }

  public async getByIdForView(id: number): Promise<ReviewForView> {
    const {
      createdAt,
      updatedAt,
      time,
      place,
      note,
      result,
      reviewerId,
      reviewerComment
    } = await this.getById(id);
    const participates = await this.topicStudentService.getStudentsParticipated(id);
    const reporters = participates.map(({ student }) => student.convertToFastView());
    let reviewer: LecturerForFastView | null = null;
    if (reviewerId) {
      reviewer = (await this.lecturerService.getById(reviewerId)).convertToFastView();
    }

    return {
      id,
      createdAt,
      updatedAt,
      time,
      place,
      note,
      reporters,
      result,
      reviewerId,
      reviewer,
      reviewerComment
    };
  }

  private checkValidTime({ studentTopicRegister, review }: Thesis, time: string | Date): void {
    if (!moment(time).isBetween(studentTopicRegister, review, 'day', '(]')) {
      throw new BadRequestException(ReviewError.ERR_3);
    }
  }

  public async checkUploadReportPermission(topicId: number, userId: number): Promise<void> {
    const topic = await this.topicService.getById(topicId);
    await this.topicService.checkPermission(topic, userId);
    this.thesisService.checkThesisIsActive(topic.thesis);

    if (topic.thesis.state !== ThesisState.REVIEW) {
      throw new BadRequestException(ReviewError.ERR_6);
    }

    if (!(await this.topicStudentService.hasParticipatedTopic(topicId, userId))) {
      throw new BadRequestException(ReviewError.ERR_4);
    }

    const review = await this.getById(topicId);
    this.checkResultIsNotDecided(review.result);
  }

  public async changeResult(
    id: number,
    { result, reviewerComment }: ReviewChangeResultRequestBody
  ): Promise<void> {
    const review = await this.getById(id);
    this.checkResultIsNotDecided(review.result);

    review.result = result;
    review.reviewerComment = reviewerComment;
    await this.reviewRepository.save(review);
  }

  public async getByIds(ids: number[]): Promise<Review[]> {
    return this.reviewRepository.findByIds(ids, { where: { ...notDeleteCondition }, cache: true });
  }

  public async checkUploadResultPermission(topicId: number, userId: number): Promise<void> {
    const { thesis } = await this.topicService.getById(topicId);
    this.thesisService.checkThesisIsActive(thesis);

    if (thesis.state !== ThesisState.REVIEW) {
      throw new BadRequestException(ReviewError.ERR_6);
    }

    const review = await this.getById(topicId);
    if (!(await this.hasReviewerPermission(review, userId))) {
      throw new BadRequestException(ReviewError.ERR_7);
    }

    this.checkResultIsNotDecided(review.result);
  }

  private checkResultIsNotDecided(result: StateResult): void {
    if (result !== StateResult.NOT_DECIDED) {
      throw new BadRequestException(ReviewError.ERR_9);
    }
  }

  public async hasReviewerPermission(review: number | Review, userId: number): Promise<boolean> {
    let reviewData: Review | undefined;
    if (typeof review === 'number') {
      reviewData = await this.getById(review);
    } else {
      reviewData = review;
    }

    return userId === reviewData.reviewerId;
  }
}
