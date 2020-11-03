import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, EntityManager, FindOptionsWhere, In, Like, Repository } from 'typeorm';

import { notDeleteCondition } from '../common/common.resource';
import { LecturerService } from '../lecturer/lecturer.service';
import { StudentService } from '../student/student.service';
import { ThesisService } from '../thesis/thesis.service';
import { User } from '../user/user.interface';
import { IsAdmin, UserType } from '../user/user.resource';
import { UserService } from '../user/user.service';
import {
  CANCELLED_STATE_NOTE,
  NEW_STATE_NOTE,
  TopicStateAction
} from './topic-state/topic-state.resource';
import { TopicStateService } from './topic-state/topic-state.service';
import { TopicStudentStatus } from './topic-student/topic-student.resouce';
import { TopicStudentService } from './topic-student/topic-student.service';
import { TopicEntity } from './topic.entity';
import { Topic, TopicChangeStatusRequestBody, TopicRequestBody } from './topic.interface';
import { TopicError, TopicRegisterStatus } from './topic.resource';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(TopicEntity) private readonly topicRepository: Repository<Topic>,
    @Inject(forwardRef(() => ThesisService)) private readonly thesisService: ThesisService,
    private readonly userService: UserService,
    private readonly topicStateService: TopicStateService,
    private readonly lecturerService: LecturerService,
    private readonly connection: Connection,
    private readonly topicStudentService: TopicStudentService,
    private readonly studentService: StudentService
  ) {}

  public async create(thesisId: number, topicBody: TopicRequestBody): Promise<Topic> {
    const thesis = await this.thesisService.getById(thesisId);
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

  public async getMany(
    thesisId: number,
    offset: number,
    limit: number,
    loginUserId: number,
    keyword?: string
  ): Promise<Topic[]> {
    const loginUser = await this.userService.findById(loginUserId);

    if (loginUser.isAdmin === IsAdmin.TRUE) {
      return this.getManyForAdmin(thesisId, loginUserId, offset, limit, keyword);
    }

    if (loginUser.userType === UserType.LECTURER) {
      return this.getManyForLecturer(thesisId, loginUserId, offset, limit, keyword);
    }

    if (loginUser.userType === UserType.STUDENT) {
      return this.getManyForStudent(thesisId, offset, limit, keyword);
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
    const ownerConditions: FindOptionsWhere<Topic> = {
      ...notDeleteCondition,
      thesisId,
      creatorId: loginUserId
    };
    const adminConditions: FindOptionsWhere<Topic> = {
      ...notDeleteCondition,
      thesisId,
      status: In([
        TopicStateAction.APPROVED,
        TopicStateAction.SEND_REQUEST,
        TopicStateAction.REJECTED,
        TopicStateAction.CANCELED
      ])
    };

    return this.topicRepository.find({
      relations: { creator: { user: {} }, thesis: {} },
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
    const ownerConditions: FindOptionsWhere<Topic> = {
      ...notDeleteCondition,
      thesisId,
      creatorId: loginUserId
    };
    const thesisConditions: FindOptionsWhere<Topic> = {
      ...notDeleteCondition,
      thesisId,
      status: TopicStateAction.APPROVED
    };

    return this.topicRepository.find({
      relations: { creator: { user: {} }, thesis: {} },
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
      cache: true
    });
  }

  private async getManyForStudent(
    thesisId: number,
    offset: number,
    limit: number,
    keyword?: string
  ): Promise<Topic[]> {
    const conditions: FindOptionsWhere<Topic> = {
      ...notDeleteCondition,
      thesisId,
      status: TopicStateAction.APPROVED
    };

    return this.topicRepository.find({
      relations: { creator: { user: {} } },
      where: keyword
        ? [
            { ...conditions, subject: Like(`%${keyword}%`) },
            { ...conditions, description: Like(`%${keyword}%`) }
          ]
        : conditions,
      skip: offset,
      take: limit,
      cache: true
    });
  }

  public async getAmount(thesisId: number, loginUserId: number, keyword?: string): Promise<number> {
    const loginUser = await this.userService.findById(loginUserId);

    if (loginUser.isAdmin === IsAdmin.TRUE) {
      return this.getAmountForAdmin(thesisId, keyword);
    }

    if (loginUser.userType === UserType.LECTURER) {
      return this.getAmountForLecturer(thesisId, loginUserId, keyword);
    }

    if (loginUser.userType === UserType.STUDENT) {
      return this.getAmountForStudent(thesisId, keyword);
    }

    return 0;
  }

  private async getAmountForAdmin(thesisId: number, keyword?: string): Promise<number> {
    const conditions: FindOptionsWhere<Topic> = {
      ...notDeleteCondition,
      thesisId,
      status: In([
        TopicStateAction.APPROVED,
        TopicStateAction.SEND_REQUEST,
        TopicStateAction.REJECTED
      ])
    };

    return this.topicRepository.count(
      keyword
        ? [
            { ...conditions, subject: Like(`%${keyword}%`) },
            { ...conditions, description: Like(`%${keyword}%`) }
          ]
        : conditions
    );
  }

  private async getAmountForLecturer(
    thesisId: number,
    loginUserId: number,
    keyword?: string
  ): Promise<number> {
    const ownerConditions: FindOptionsWhere<Topic> = {
      ...notDeleteCondition,
      thesisId,
      creatorId: loginUserId
    };
    const thesisConditions: FindOptionsWhere<Topic> = {
      ...notDeleteCondition,
      thesisId,
      status: TopicStateAction.APPROVED
    };

    return this.topicRepository.count(
      keyword
        ? [
            { ...ownerConditions, subject: Like(`%${keyword}%`) },
            { ...ownerConditions, description: Like(`%${keyword}%`) },
            { ...thesisConditions, subject: Like(`%${keyword}%`) },
            { ...thesisConditions, description: Like(`%${keyword}%`) }
          ]
        : [ownerConditions, thesisConditions]
    );
  }

  private async getAmountForStudent(thesisId: number, keyword?: string): Promise<number> {
    const conditions: FindOptionsWhere<Topic> = {
      ...notDeleteCondition,
      thesisId,
      status: TopicStateAction.APPROVED
    };

    return this.topicRepository.count(
      keyword
        ? [
            { ...conditions, subject: Like(`%${keyword}%`) },
            { ...conditions, description: Like(`%${keyword}%`) }
          ]
        : conditions
    );
  }

  public async getById(id: number, loginUser: User): Promise<Topic> {
    const topic = await this.topicRepository.findOne(
      { ...notDeleteCondition, id },
      {
        relations: {
          creator: { user: {} }
        },
        cache: true
      }
    );
    if (!topic) {
      throw new BadRequestException(TopicError.ERR_5);
    }

    if (loginUser.isAdmin === IsAdmin.TRUE || loginUser.id === topic.creatorId) {
      topic.approver = await this.lecturerService.getById(topic.approverId);
      topic.states = await this.topicStateService.getMany(topic.id);
    }

    if (
      loginUser.isAdmin === IsAdmin.TRUE ||
      loginUser.id === topic.creatorId ||
      loginUser.userType === UserType.STUDENT
    ) {
      topic.students = await this.topicStudentService.getMany(topic.id);
    }

    return topic;
  }

  public async hasPermission(id: number, user: User): Promise<boolean> {
    const topic = await this.getById(id, user);

    if (user.isAdmin === IsAdmin.TRUE) {
      return topic.status !== TopicStateAction.NEW || topic.creatorId === user.id;
    }

    if (user.userType === UserType.LECTURER) {
      return topic.creatorId === user.id || topic.status === TopicStateAction.APPROVED;
    }

    if (user.userType === UserType.STUDENT) {
      return topic.status === TopicStateAction.APPROVED;
    }

    return false;
  }

  public async checkPermission(id: number, user: User): Promise<void> {
    if (!(await this.hasPermission(id, user))) {
      throw new BadRequestException(TopicError.ERR_6);
    }
  }

  public async updateById(topicId: number, user: User, data: TopicRequestBody): Promise<Topic> {
    const currentTopic = await this.getById(topicId, user);
    if (!this.canEdit(user, currentTopic)) {
      throw new BadRequestException(TopicError.ERR_6);
    }

    return this.topicRepository.save({ ...currentTopic, ...data });
  }

  private canEdit(user: User, topic: Topic): boolean {
    return (
      user.id === topic.creatorId &&
      (topic.status === TopicStateAction.NEW || topic.status === TopicStateAction.WITHDRAW)
    );
  }

  public async deleteById(topicId: number, user: User): Promise<void> {
    const currentTopic = await this.getById(topicId, user);
    if (!this.canEdit(user, currentTopic)) {
      throw new BadRequestException(TopicError.ERR_6);
    }

    await this.connection.transaction(async (manager) => {
      const deletedAt = new Date();
      const stateIds = currentTopic.states.map(({ id }) => id);
      await this.topicStateService.deleteByIdsWithTransaction(manager, stateIds, deletedAt);
      await this.topicStudentService.deleteByTopicIdsWithTransaction(manager, topicId, deletedAt);
      await manager.update(TopicEntity, { id: topicId }, { deletedAt });
    });
  }

  public async changeStatus(
    topicId: number,
    user: User,
    data: TopicChangeStatusRequestBody
  ): Promise<void> {
    const { action, note } = data;
    const topic = await this.getById(topicId, user);
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

    await this.handleChangeStatus(topic, user.id, action, note);
  }

  private async handleChangeStatus(
    topic: Topic,
    processorId: number,
    action: TopicStateAction,
    note?: string
  ) {
    topic.status = action;
    topic.states.push(
      this.topicStateService.createEntity({
        topicId: topic.id,
        processorId,
        action: action,
        note: note || null
      })
    );
    await this.topicRepository.save(topic);
  }

  public async changeRegisterStatus(topicId: number, user: User): Promise<void> {
    const topic = await this.getById(topicId, user);
    if (topic.creatorId !== user.id) {
      throw new BadRequestException(TopicError.ERR_6);
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
    const student = await this.studentService.findById(studentId);
    const topic = await this.getById(topicId, student.user);
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
    user: User,
    topicId: number,
    studentId: number,
    status: TopicStudentStatus
  ): Promise<void> {
    const topic = await this.getById(topicId, user);
    if (user.userType !== UserType.LECTURER && topic.creatorId !== user.id) {
      throw new BadRequestException(TopicError.ERR_14);
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

        await manager.save(TopicEntity, topic);
      });
    } else {
      await this.topicStudentService.changeRegisterStatus(topicId, studentId, status);
    }
  }

  private async getManyByThesisId(thesisId: number): Promise<Topic[]> {
    return this.topicRepository.find({
      where: {
        ...notDeleteCondition,
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
      relations: { states: {} },
      where: {
        ...notDeleteCondition,
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
      where: { ...notDeleteCondition, thesisId, status: TopicStateAction.APPROVED },
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
      { ...notDeleteCondition, thesisId, registerStatus: TopicRegisterStatus.ENABLE },
      { registerStatus: TopicRegisterStatus.DISABLE }
    );
  }
}
