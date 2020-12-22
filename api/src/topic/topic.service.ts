import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, EntityManager, FindConditions, In, Like, Repository } from 'typeorm';

import { CommentService } from '../comment/comment.service';
import { CouncilService } from '../council/council.service';
import { DefenseService } from '../defense/defense.service';
import { LecturerService } from '../lecturer/lecturer.service';
import { ProgressReportService } from '../progress-report/progress-report.service';
import { ResultType } from '../result/result.resource';
import { ResultService } from '../result/result.service';
import { ReviewService } from '../review/review.service';
import { StudentService } from '../student/student.service';
import { ThesisState } from '../thesis/thesis.resource';
import { ThesisService } from '../thesis/thesis.service';
import { Thesis } from '../thesis/thesis.type';
import { IsAdmin, UserType } from '../user/user.resource';
import { UserService } from '../user/user.service';
import { User } from '../user/user.type';
import { TopicEntity } from './entities/topic.entity';
import {
  CANCELLED_STATE_NOTE,
  NEW_STATE_NOTE,
  TopicStateAction
} from './topic-state/topic-state.resource';
import { TopicStateService } from './topic-state/topic-state.service';
import { TopicState } from './topic-state/topic-state.type';
import { TopicStudentStatus } from './topic-student/topic-student.resouce';
import { TopicStudentService } from './topic-student/topic-student.service';
import { StateResult, TopicError, TopicRegisterStatus } from './topic.resource';
import { Topic, TopicChangeStatusRequestBody, TopicForView, TopicRequestBody } from './topic.type';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(TopicEntity) private readonly topicRepository: Repository<Topic>,
    @Inject(forwardRef(() => ThesisService))
    private readonly thesisService: ThesisService,
    private readonly userService: UserService,
    private readonly topicStateService: TopicStateService,
    @Inject(forwardRef(() => LecturerService))
    private readonly lecturerService: LecturerService,
    private readonly connection: Connection,
    private readonly topicStudentService: TopicStudentService,
    @Inject(forwardRef(() => StudentService))
    private readonly studentService: StudentService,
    private readonly progressReportService: ProgressReportService,
    private readonly commentService: CommentService,
    private readonly reviewService: ReviewService,
    @Inject(forwardRef(() => DefenseService))
    private readonly defenseService: DefenseService,
    @Inject(forwardRef(() => ResultService))
    private readonly resultService: ResultService,
    private readonly councilService: CouncilService
  ) {}

  public async create(thesisId: number, topicBody: TopicRequestBody): Promise<Topic> {
    await this.thesisService.checkPermission(thesisId, topicBody.creatorId);
    const thesis = await this.thesisService.getById(thesisId);
    this.thesisService.checkThesisIsActive(thesis.status);
    const topicEntity = await this.topicRepository.create({ ...topicBody, thesisId });
    topicEntity.approverId = thesis.creatorId;
    const newState = this.topicStateService.createEntity({
      topicId: topicEntity.id,
      processorId: topicBody.creatorId,
      note: NEW_STATE_NOTE
    });
    topicEntity.states = [newState];

    return this.topicRepository.save(topicEntity);
  }

  private async filterTopicHasNotPermission(
    topics: Topic[],
    userId: number | User
  ): Promise<Topic[]> {
    let user: User | undefined;
    if (typeof userId === 'number') {
      user = await this.userService.getById(userId);
    } else {
      user = userId;
    }

    const result: Topic[] = [];
    for (const topic of topics) {
      if (await this.hasPermission(topic, user)) {
        result.push(topic);
      }
    }

    return result;
  }

  public async getMany(
    thesisId: number,
    offset: number,
    limit: number,
    loginUserId: number,
    keyword?: string
  ): Promise<Topic[]> {
    const loginUser = await this.userService.getById(loginUserId);

    if (loginUser.isAdmin === IsAdmin.TRUE) {
      return this.getManyForAdmin(thesisId, loginUserId, offset, limit, keyword);
    }

    if (loginUser.userType === UserType.LECTURER) {
      return this.getManyForLecturer(thesisId, loginUserId, offset, limit, keyword);
    }

    if (loginUser.userType === UserType.STUDENT) {
      return this.getManyForStudent(thesisId, offset, limit, loginUserId, keyword);
    }

    return [];
  }

  private async getManyForAdmin(
    thesisId: number,
    loginUserId: number,
    offset: number,
    limit: number,
    keyword?: string
  ): Promise<Topic[]> {
    const ownerConditions: FindConditions<Topic> = {
      thesisId,
      creatorId: loginUserId
    };
    const adminConditions: FindConditions<Topic> = {
      thesisId,
      status: In([
        TopicStateAction.APPROVED,
        TopicStateAction.SEND_REQUEST,
        TopicStateAction.REJECTED,
        TopicStateAction.CANCELED
      ])
    };

    return this.topicRepository.find({
      relations: ['creator', 'creator.user', 'thesis'],
      where: keyword
        ? [
            { ...adminConditions, subject: Like(`%${keyword}%`) },
            { ...adminConditions, description: Like(`%${keyword}%`) },
            { ...ownerConditions, subject: Like(`%${keyword}%`) },
            { ...ownerConditions, description: Like(`%${keyword}%`) }
          ]
        : [adminConditions, ownerConditions],
      skip: offset,
      take: limit,
      order: {
        status: 'ASC'
      },
      cache: true
    });
  }

  private async getManyForLecturer(
    thesisId: number,
    loginUserId: number,
    offset: number,
    limit: number,
    keyword?: string
  ): Promise<Topic[]> {
    const ownerConditions: FindConditions<Topic> = {
      thesisId,
      creatorId: loginUserId
    };
    const thesisConditions: FindConditions<Topic> = {
      thesisId,
      status: TopicStateAction.APPROVED
    };

    const topics = await this.topicRepository.find({
      relations: ['creator', 'creator.user', 'thesis'],
      where: keyword
        ? [
            { ...ownerConditions, subject: Like(`%${keyword}%`) },
            { ...ownerConditions, description: Like(`%${keyword}%`) },
            { ...thesisConditions, subject: Like(`%${keyword}%`) },
            { ...thesisConditions, description: Like(`%${keyword}%`) }
          ]
        : [ownerConditions, thesisConditions],
      skip: offset,
      take: limit,
      order: {
        status: 'ASC'
      },
      cache: true
    });

    return this.filterTopicHasNotPermission(topics, loginUserId);
  }

  private async getManyForStudent(
    thesisId: number,
    offset: number,
    limit: number,
    loginUser: number,
    keyword?: string
  ): Promise<Topic[]> {
    const conditions: FindConditions<Topic> = {
      thesisId,
      status: TopicStateAction.APPROVED
    };

    const topics = await this.topicRepository.find({
      relations: ['creator', 'creator.user', 'thesis'],
      where: keyword
        ? [
            { ...conditions, subject: Like(`%${keyword}%`) },
            { ...conditions, description: Like(`%${keyword}%`) }
          ]
        : conditions,
      skip: offset,
      take: limit,
      order: {
        status: 'ASC'
      },
      cache: true
    });

    return this.filterTopicHasNotPermission(topics, loginUser);
  }

  public async getAmount(thesisId: number, loginUserId: number, keyword?: string): Promise<number> {
    const loginUser = await this.userService.getById(loginUserId);

    if (loginUser.isAdmin === IsAdmin.TRUE) {
      return this.getAmountForAdmin(thesisId, keyword);
    }

    if (loginUser.userType === UserType.LECTURER) {
      return this.getAmountForLecturer(thesisId, loginUser, keyword);
    }

    if (loginUser.userType === UserType.STUDENT) {
      return this.getAmountForStudent(thesisId, loginUser, keyword);
    }

    return 0;
  }

  private async getAmountForAdmin(thesisId: number, keyword?: string): Promise<number> {
    const conditions: FindConditions<Topic> = {
      thesisId,
      status: In([
        TopicStateAction.APPROVED,
        TopicStateAction.SEND_REQUEST,
        TopicStateAction.REJECTED
      ])
    };

    return this.topicRepository.count({
      relations: ['creator', 'creator.user', 'thesis'],
      where: keyword
        ? [
            { ...conditions, subject: Like(`%${keyword}%`) },
            { ...conditions, description: Like(`%${keyword}%`) }
          ]
        : conditions,
      cache: true
    });
  }

  private async getAmountForLecturer(
    thesisId: number,
    loginUser: User,
    keyword?: string
  ): Promise<number> {
    const ownerConditions: FindConditions<Topic> = {
      thesisId,
      creatorId: loginUser.id
    };
    const thesisConditions: FindConditions<Topic> = {
      thesisId,
      status: TopicStateAction.APPROVED
    };

    const topics = await this.topicRepository.find({
      relations: ['creator', 'creator.user', 'thesis'],
      where: keyword
        ? [
            { ...ownerConditions, subject: Like(`%${keyword}%`) },
            { ...ownerConditions, description: Like(`%${keyword}%`) },
            { ...thesisConditions, subject: Like(`%${keyword}%`) },
            { ...thesisConditions, description: Like(`%${keyword}%`) }
          ]
        : [ownerConditions, thesisConditions],
      cache: true
    });

    return (await this.filterTopicHasNotPermission(topics, loginUser)).length;
  }

  private async getAmountForStudent(
    thesisId: number,
    loginUser: User,
    keyword?: string
  ): Promise<number> {
    const conditions: FindConditions<Topic> = {
      thesisId,
      status: TopicStateAction.APPROVED
    };

    const topics = await this.topicRepository.find({
      relations: ['creator', 'creator.user', 'thesis'],
      where: keyword
        ? [
            { ...conditions, subject: Like(`%${keyword}%`) },
            { ...conditions, description: Like(`%${keyword}%`) }
          ]
        : conditions,
      cache: true
    });

    return (await this.filterTopicHasNotPermission(topics, loginUser)).length;
  }

  public async getById(id: number, includeThesis = false): Promise<Topic> {
    const relations = ['creator', 'creator.user'];
    if (includeThesis) {
      relations.push('thesis');
    }

    const topic = await this.topicRepository.findOne(id, {
      relations,
      cache: true
    });
    if (!topic) {
      throw new BadRequestException(TopicError.ERR_5);
    }

    return topic;
  }

  public async hasPermission(topic: Topic, user: User): Promise<boolean> {
    if (topic.thesis.creatorId === user.id && user.isAdmin === IsAdmin.TRUE) {
      return topic.status !== TopicStateAction.NEW || topic.creatorId === user.id;
    }

    switch (user.userType) {
      case UserType.LECTURER:
        if (
          (topic.thesis.state >= ThesisState.REVIEW &&
            (await this.reviewService.hasReviewerPermission(topic.id, user.id))) ||
          (topic.thesis.state >= ThesisState.DEFENSE &&
            (await this.defenseService.hasCouncilPermission(topic.id, user.id))) ||
          topic.creatorId === user.id
        ) {
          return true;
        }

        break;
      case UserType.STUDENT:
        if (
          (topic.thesis.state === ThesisState.STUDENT_TOPIC_REGISTER &&
            topic.status === TopicStateAction.APPROVED) ||
          (await this.topicStudentService.hasParticipatedTopic(topic.id, user.id))
        ) {
          return true;
        }

        break;
    }

    return false;
  }

  public async checkPermission(topicId: number | Topic, userId: number | User): Promise<void> {
    let topic: Topic;
    if (typeof topicId === 'number') {
      topic = await this.getById(topicId, true);
    } else {
      topic = topicId;
    }

    let user: User;
    if (typeof userId === 'number') {
      user = await this.userService.getById(userId);
    } else {
      user = userId;
    }

    await this.thesisService.checkPermission(topic.thesis, user);
    if (!(await this.hasPermission(topic, user))) {
      throw new BadRequestException(TopicError.ERR_6);
    }
  }

  public async updateById(topicId: number, userId: number, data: TopicRequestBody): Promise<Topic> {
    const currentTopic = await this.getById(topicId, true);
    const user = await this.userService.getById(userId);
    await this.checkPermission(currentTopic, user);
    this.thesisService.checkThesisIsActive(currentTopic.thesis.status);
    if (!this.canEdit(user, currentTopic)) {
      throw new BadRequestException(TopicError.ERR_17);
    }

    return this.topicRepository.save({ ...currentTopic, ...data });
  }

  private canEdit(user: User, topic: Topic): boolean {
    return (
      user.id === topic.creatorId &&
      (topic.status === TopicStateAction.NEW || topic.status === TopicStateAction.WITHDRAW)
    );
  }

  public async deleteById(topicId: number, userId: number): Promise<void> {
    const currentTopic = await this.getById(topicId);
    const user = await this.userService.getById(userId);
    if (!this.canEdit(user, currentTopic)) {
      throw new BadRequestException(TopicError.ERR_18);
    }

    await this.connection.transaction(async (manager) => {
      await this.deleteCascadeWithTransaction(manager, topicId, new Date());
    });
  }

  public async changeStatus(
    topicId: number,
    userId: number,
    data: TopicChangeStatusRequestBody
  ): Promise<TopicState[]> {
    const { action, note } = data;
    const user = await this.userService.getById(userId);
    const topic = await this.topicRepository.findOne(topicId, {
      relations: ['states', 'states.processor', 'states.processor.user', 'thesis'],
      cache: true
    });
    if (!topic) {
      throw new BadRequestException(TopicError.ERR_5);
    }

    await this.checkPermission(topic, user);
    const creatorActions = [
      TopicStateAction.SEND_REQUEST,
      TopicStateAction.WITHDRAW,
      TopicStateAction.CANCELED
    ];
    const approverActions = [
      TopicStateAction.APPROVED,
      TopicStateAction.REJECTED,
      TopicStateAction.SEND_BACK
    ];

    // Prevent duplicate action
    if (action === TopicStateAction.NEW || action === topic.status) {
      throw new BadRequestException(TopicError.ERR_7);
    }

    if (topic.creatorId !== topic.approverId) {
      // Check creator action
      if (user.id === topic.creatorId && !creatorActions.includes(action)) {
        throw new BadRequestException(TopicError.ERR_7);
      }

      // Check approver action
      if (user.id === topic.approverId && !approverActions.includes(action)) {
        throw new BadRequestException(TopicError.ERR_7);
      }
    }

    // When action from approver
    if (
      (action === TopicStateAction.APPROVED ||
        action === TopicStateAction.REJECTED ||
        action === TopicStateAction.SEND_BACK) &&
      topic.status !== TopicStateAction.SEND_REQUEST
    ) {
      throw new BadRequestException(TopicError.ERR_7);
    }

    // When action is send approval request
    if (
      action === TopicStateAction.SEND_REQUEST &&
      topic.status !== TopicStateAction.NEW &&
      topic.status !== TopicStateAction.WITHDRAW &&
      topic.status !== TopicStateAction.SEND_BACK
    ) {
      throw new BadRequestException(TopicError.ERR_7);
    }

    // When action is withdraw the sent approval request
    if (action === TopicStateAction.WITHDRAW && topic.status !== TopicStateAction.SEND_REQUEST) {
      throw new BadRequestException(TopicError.ERR_7);
    }

    // When action is canceled topic (new and withdraw)
    if (
      action === TopicStateAction.CANCELED &&
      topic.status !== TopicStateAction.NEW &&
      topic.status !== TopicStateAction.WITHDRAW &&
      topic.status !== TopicStateAction.SEND_BACK
    ) {
      throw new BadRequestException(TopicError.ERR_7);
    }

    return this.handleChangeStatus(topic, user.id, action, note);
  }

  private async handleChangeStatus(
    topic: Topic,
    processorId: number,
    action: TopicStateAction,
    note?: string
  ): Promise<TopicState[]> {
    const processor = await this.lecturerService.getById(processorId);
    topic.status = action;
    topic.states.push(
      this.topicStateService.createEntity({
        topicId: topic.id,
        processorId: processor.id,
        processor,
        action: action,
        note: note || null
      })
    );

    if (action === TopicStateAction.APPROVED) {
      await this.connection.transaction(async (manager) => {
        // Create progress report appointment
        await this.progressReportService.createWithTransaction(manager, topic.id, {
          time: topic.thesis.progressReport
        });

        await manager.save(TopicEntity, topic);
      });
    } else {
      await this.topicRepository.save(topic);
    }

    return topic.states;
  }

  public async changeRegisterStatus(id: number, userId: number): Promise<void> {
    const topic = await this.getById(id);
    if (topic.creatorId !== userId) {
      throw new BadRequestException(TopicError.ERR_14);
    }

    if (topic.status !== TopicStateAction.APPROVED) {
      throw new BadRequestException(TopicError.ERR_8);
    }

    if (topic.registerStatus === TopicRegisterStatus.ENABLE) {
      topic.registerStatus = TopicRegisterStatus.DISABLE;
    } else {
      if (topic.currentStudent === topic.maxStudent) {
        throw new BadRequestException(TopicError.ERR_16);
      }

      topic.registerStatus = TopicRegisterStatus.ENABLE;
    }

    await this.topicRepository.save(topic);
  }

  public async registerTopic(topicId: number, studentId: number): Promise<void> {
    const user = await this.userService.getById(studentId);
    if (user.userType === UserType.STUDENT) {
      if (await this.topicStudentService.hasRegisteredTopic(topicId, studentId)) {
        throw new BadRequestException(TopicError.ERR_10);
      }

      const topic = await this.getById(topicId);
      const topicIds = (await this.getManyByThesisId(topic.thesisId))
        .map(({ id }) => id)
        .filter((id) => id !== topicId);
      if (await this.topicStudentService.hasParticipatedAnotherTopic(topicIds, studentId)) {
        throw new BadRequestException(TopicError.ERR_15);
      }
    }

    const topic = await this.getById(topicId, true);
    await this.checkPermission(topic, studentId);
    if (topic.status !== TopicStateAction.APPROVED) {
      throw new BadRequestException(TopicError.ERR_8);
    }

    if (topic.registerStatus === TopicRegisterStatus.DISABLE) {
      throw new BadRequestException(TopicError.ERR_13);
    }

    if (topic.currentStudent === topic.maxStudent) {
      throw new BadRequestException(TopicError.ERR_9);
    }

    await this.topicStudentService.registerTopic(topicId, studentId);
  }

  public async changeStudentRegisterStatus(
    userId: number,
    topicId: number,
    studentId: number,
    status: TopicStudentStatus
  ): Promise<void> {
    const user = await this.userService.getById(userId);
    const topic = await this.getById(topicId, true);
    await this.checkPermission(topic, user);
    if (topic.creatorId !== user.id) {
      throw new BadRequestException(TopicError.ERR_14);
    }

    if (topic.currentStudent === topic.maxStudent) {
      throw new BadRequestException(TopicError.ERR_9);
    }

    const topicStudent = await this.topicStudentService.getOne(topicId, studentId);
    if (
      status === TopicStudentStatus.PENDING ||
      status === topicStudent.status ||
      topicStudent.status !== TopicStudentStatus.PENDING
    ) {
      throw new BadRequestException(TopicError.ERR_7);
    }

    if (status === TopicStudentStatus.APPROVED) {
      const anotherTopicIds = (await this.getManyByThesisId(topic.thesisId))
        .map(({ id }) => id)
        .filter((id) => id !== topicId);

      await this.connection.transaction(async (manager) => {
        await this.topicStudentService.changeRegisterStatusWithTransaction(
          manager,
          topicId,
          studentId,
          status
        );
        await this.topicStudentService.rejectRegisterOfStudentByTopicIdsWithTransaction(
          manager,
          anotherTopicIds,
          studentId
        );

        topic.currentStudent++;
        if (topic.currentStudent === topic.maxStudent) {
          topic.registerStatus = TopicRegisterStatus.DISABLE;
        }

        await manager.update(
          TopicEntity,
          { id: topicId },
          { currentStudent: topic.currentStudent, registerStatus: topic.registerStatus }
        );
      });
    } else {
      await this.topicStudentService.changeRegisterStatus(topicId, studentId, status);
    }
  }

  public async getManyByThesisId(thesisId: number): Promise<Topic[]> {
    return this.topicRepository.find({
      where: {
        thesisId
      },
      cache: true
    });
  }

  public async cancelTopicsByThesisIdWithTransaction(
    manager: EntityManager,
    thesisId: number
  ): Promise<void> {
    const topics = await this.getPendingTopicsByThesisIdWithTransaction(manager, thesisId);
    if (topics.length > 0) {
      for (const topic of topics) {
        topic.states.push(
          this.topicStateService.createEntity({
            topicId: topic.id,
            processorId: topic.creatorId,
            action: TopicStateAction.CANCELED,
            note: CANCELLED_STATE_NOTE
          })
        );
        topic.status = TopicStateAction.CANCELED;
      }
      await manager.save(topics);
    }
  }

  private async getPendingTopicsByThesisIdWithTransaction(
    manager: EntityManager,
    thesisId: number
  ): Promise<Topic[]> {
    return manager.find(TopicEntity, {
      relations: ['states'],
      where: {
        thesisId,
        status: In([
          TopicStateAction.NEW,
          TopicStateAction.SEND_REQUEST,
          TopicStateAction.WITHDRAW,
          TopicStateAction.SEND_BACK
        ])
      },
      cache: true
    });
  }

  public async rejectTopicRegisterByThesisIdWithTransaction(
    manager: EntityManager,
    thesisId: number
  ): Promise<void> {
    const topics = await manager.find(TopicEntity, {
      where: { thesisId, status: TopicStateAction.APPROVED },
      cache: true
    });
    const topicIds = topics.map(({ id }) => id);
    await this.topicStudentService.rejectRegisterByTopicIdsWithTransaction(manager, topicIds);
  }

  public async disableRegisterStatusByThesisIdWithTransaction(
    manager: EntityManager,
    thesisId: number
  ): Promise<void> {
    await manager.update(
      TopicEntity,
      { thesisId, registerStatus: TopicRegisterStatus.ENABLE },
      { registerStatus: TopicRegisterStatus.DISABLE }
    );
  }

  public async checkTopicIsExisted(topicId: number): Promise<void> {
    if ((await this.topicRepository.count({ id: topicId })) === 0) {
      throw new BadRequestException(TopicError.ERR_5);
    }
  }

  public async deleteByThesisIdWithTransaction(
    manager: EntityManager,
    thesisId: number,
    deletedAt = new Date()
  ): Promise<void> {
    const topics = await manager.find(TopicEntity, {
      where: { thesisId },
      cache: true
    });
    for (const topic of topics) {
      await this.deleteCascadeWithTransaction(manager, topic.id, deletedAt);
    }
  }

  private async deleteCascadeWithTransaction(
    manager: EntityManager,
    topicId: number,
    deletedAt = new Date()
  ): Promise<void> {
    await Promise.all([
      this.topicStateService.deleteByTopicIdWithTransaction(manager, topicId, deletedAt),
      this.topicStudentService.deleteByTopicIdsWithTransaction(manager, topicId, deletedAt),
      this.progressReportService.deleteByTopicIdWithTransaction(manager, topicId, deletedAt),
      this.commentService.deleteByTopicIdWithTransaction(manager, topicId, deletedAt),
      this.reviewService.deleteByIdWithTransaction(manager, topicId, deletedAt),
      this.defenseService.deleteByIdWithTransaction(manager, topicId, deletedAt),
      this.resultService.deleteByTopicIdWithTransaction(manager, topicId, deletedAt)
    ]);
    await manager.update(TopicEntity, { id: topicId }, { deletedAt });
  }

  public async createReviewWithTransaction(manager: EntityManager, thesis: Thesis): Promise<void> {
    const topics = await this.getByConditionsWithTransaction(manager, {
      thesisId: thesis.id,
      status: TopicStateAction.APPROVED
    });
    const topicIds = topics.map(({ id }) => id);
    const [progressReports, reviews] = await Promise.all([
      this.progressReportService.getByIds(topicIds),
      this.reviewService.getByIds(topicIds)
    ]);
    for (const topic of topics) {
      const progressReport = progressReports.find(({ id }) => id === topic.id);
      const isReviewExisted = reviews.findIndex(({ id }) => id === topic.id) >= 0;
      if (!progressReport || isReviewExisted) {
        continue;
      }

      if (progressReport.result === StateResult.PASSED) {
        await this.reviewService.createWithTransaction(manager, {
          id: topic.id,
          time: thesis.review
        });
      }
    }
  }

  public async createDefenseWithTransaction(manager: EntityManager, thesis: Thesis): Promise<void> {
    const topics = await this.getByConditionsWithTransaction(manager, {
      thesisId: thesis.id,
      status: TopicStateAction.APPROVED
    });
    const topicIds = topics.map(({ id }) => id);
    const [reviews, defenses] = await Promise.all([
      this.reviewService.getByIds(topicIds),
      this.defenseService.getByIds(topicIds)
    ]);
    for (const topic of topics) {
      const review = reviews.find(({ id }) => id === topic.id);
      const isDefenseExisted = defenses.findIndex(({ id }) => id === topic.id) >= 0;
      if (!review || isDefenseExisted) {
        continue;
      }

      if (review.result === StateResult.PASSED) {
        await this.defenseService.createWithTransaction(manager, {
          id: topic.id,
          time: thesis.review
        });
      }
    }
  }

  private async getByConditionsWithTransaction(
    manager: EntityManager,
    conditions: FindConditions<Topic>
  ): Promise<Topic[]> {
    return manager.find(TopicEntity, {
      where: conditions,
      cache: true
    });
  }

  public async checkCreatorPermission(topicId: number | Topic, userId: number): Promise<void> {
    let topic: Topic;
    if (typeof topicId === 'number') {
      topic = await this.getById(topicId);
    } else {
      topic = topicId;
    }

    if (topic.creatorId !== userId) {
      throw new BadRequestException(TopicError.ERR_14);
    }
  }

  public async createResultWithTransaction(manager: EntityManager, thesis: Thesis): Promise<void> {
    const topics = await this.getByConditionsWithTransaction(manager, {
      thesisId: thesis.id,
      status: TopicStateAction.APPROVED
    });
    const topicIds = topics.map(({ id }) => id);
    const [reviews, defenses] = await Promise.all([
      this.reviewService.getByIds(topicIds),
      this.defenseService.getByIds(topicIds)
    ]);
    for (const topic of topics) {
      const students = await this.topicStudentService.getStudentsParticipated(topic.id);
      for (const student of students) {
        const defense = defenses.find(({ id }) => id === topic.id);
        const review = reviews.find(({ id }) => id === topic.id);
        if (!review || !defense) {
          // Failed thesis
          continue;
        }

        await this.resultService.initializeResultWithTransaction(manager, {
          topicId: topic.id,
          creatorId: topic.creatorId,
          studentId: student.studentId,
          type: ResultType.INSTRUCTOR
        });

        if (review.reviewerId) {
          await this.resultService.initializeResultWithTransaction(manager, {
            topicId: topic.id,
            creatorId: review.reviewerId,
            studentId: student.studentId,
            type: ResultType.REVIEW
          });
        }

        if (defense.councilId) {
          const council = await this.councilService.getById(defense.councilId);
          await this.resultService.initializeResultWithTransaction(manager, {
            topicId: topic.id,
            creatorId: council.chairmanId,
            studentId: student.studentId,
            type: ResultType.DEFENSE
          });
          await this.resultService.initializeResultWithTransaction(manager, {
            topicId: topic.id,
            creatorId: council.instructorId,
            studentId: student.studentId,
            type: ResultType.DEFENSE
          });
          await this.resultService.initializeResultWithTransaction(manager, {
            topicId: topic.id,
            creatorId: council.commissionerId,
            studentId: student.studentId,
            type: ResultType.DEFENSE
          });
        }
      }
    }
  }

  public async enableRegisterByThesisIdWithTransaction(
    manager: EntityManager,
    thesisId: number
  ): Promise<void> {
    const topics = await manager.find(TopicEntity, { thesisId });
    topics.forEach((topic) => {
      if (topic.currentStudent < topic.maxStudent) {
        topic.registerStatus = TopicRegisterStatus.ENABLE;
      }
    });
    await manager.save(topics);
  }

  public async convertForView({ approverId, creator, ...remain }: Topic): Promise<TopicForView> {
    const approver = (await this.lecturerService.getById(approverId)).convertToFastView();

    return {
      ...remain,
      creator: creator.convertToFastView(),
      approver
    };
  }
}
