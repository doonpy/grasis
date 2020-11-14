import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { EntityManager, Repository } from 'typeorm';

import { notDeleteCondition } from '../common/common.resource';
import { LecturerService } from '../lecturer/lecturer.service';
import { LecturerForFastView } from '../lecturer/lecturer.type';
import { ThesisStudentService } from '../thesis/thesis-student/thesis-student.service';
import { ThesisState, ThesisStatus } from '../thesis/thesis.resource';
import { ThesisService } from '../thesis/thesis.service';
import { Thesis } from '../thesis/thesis.type';
import { TopicStudentService } from '../topic/topic-student/topic-student.service';
import { StateResult } from '../topic/topic.resource';
import { TopicService } from '../topic/topic.service';
import { UserType } from '../user/user.resource';
import { UserService } from '../user/user.service';
import { User } from '../user/user.type';
import { ReviewEntity } from './review.entity';
import { ReviewError } from './review.resource';
import { Review, ReviewForView, ReviewRequestBody } from './review.type';

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
    private readonly lecturerService: LecturerService,
    private readonly thesisStudentService: ThesisStudentService
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
    const thesis = await this.thesisService.getById(id);
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
    const { createdAt, updatedAt, time, place, note, result, reviewerId } = await this.getById(id);
    const participates = await this.topicStudentService.getStudentsParticipated(id);
    const reporters = participates.map(({ student }) => student.convertToFastView());
    let reviewerView: LecturerForFastView | null = null;
    if (reviewerId) {
      reviewerView = (await this.lecturerService.getById(reviewerId)).convertToFastView();
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
      reviewerView
    };
  }

  private checkValidTime({ studentTopicRegister, review }: Thesis, time: string | Date): void {
    if (!moment(time).isBetween(studentTopicRegister, review, 'day', '(]')) {
      throw new BadRequestException(ReviewError.ERR_3);
    }
  }

  public async checkUploadPermission(topicId: number, user: User): Promise<void> {
    const topic = await this.topicService.getById(topicId);
    if (topic.thesis.status === ThesisStatus.INACTIVE) {
      throw new BadRequestException(ReviewError.ERR_5);
    }

    if (topic.thesis.state !== ThesisState.REVIEW) {
      throw new BadRequestException(ReviewError.ERR_6);
    }

    if (
      user.userType !== UserType.STUDENT ||
      !(await this.topicStudentService.hasRegisteredTopic(topicId, user.id))
    ) {
      throw new BadRequestException(ReviewError.ERR_4);
    }

    await this.topicService.checkPermission(topicId, user);
  }

  public async changeResult(id: number, userId: number, result: StateResult): Promise<void> {
    const loginUser = await this.userService.findById(userId);
    await this.topicService.checkPermission(id, loginUser);
    const review = await this.getById(id);
    if (review.reviewerId !== userId) {
      throw new BadRequestException(ReviewError.ERR_7);
    }

    review.result = result;
    await this.reviewRepository.save(review);
  }
}
