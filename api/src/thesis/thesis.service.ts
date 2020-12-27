import { BadRequestException, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import moment, { Moment } from 'moment';
import {
  Connection,
  EntityManager,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Not,
  Repository,
  SelectQueryBuilder
} from 'typeorm';
import { FindConditions } from 'typeorm/find-options/FindConditions';

import { CouncilService } from '../council/council.service';
import { LecturerError } from '../lecturer/lecturer.resource';
import { LecturerService } from '../lecturer/lecturer.service';
import { StudentError } from '../student/student.resource';
import { StudentService } from '../student/student.service';
import { TopicService } from '../topic/topic.service';
import { IsAdmin, UserType } from '../user/user.resource';
import { UserService } from '../user/user.service';
import { User } from '../user/user.type';
import { ThesisLecturerColumn } from './thesis-lecturer/thesis-lecturer.resource';
import { ThesisLecturerService } from './thesis-lecturer/thesis-lecturer.service';
import { ThesisLecturer } from './thesis-lecturer/thesis-lecturer.type';
import { ThesisStudentColumn } from './thesis-student/thesis-student.resource';
import { ThesisStudentService } from './thesis-student/thesis-student.service';
import { ThesisStudent } from './thesis-student/thesis-student.type';
import { ThesisEntity } from './thesis.entity';
import { ThesisError, ThesisState, ThesisStatus } from './thesis.resource';
import {
  Thesis,
  ThesisForEdit,
  ThesisForListView,
  ThesisForView,
  ThesisRequestBody
} from './thesis.type';

@Injectable()
export class ThesisService {
  constructor(
    @InjectRepository(ThesisEntity) private readonly thesisRepository: Repository<Thesis>,
    private readonly connection: Connection,
    @Inject(forwardRef(() => LecturerService))
    private readonly lecturerService: LecturerService,
    private readonly studentService: StudentService,
    private readonly thesisStudentService: ThesisStudentService,
    private readonly thesisLecturerService: ThesisLecturerService,
    private readonly userService: UserService,
    private readonly topicService: TopicService,
    private readonly councilService: CouncilService
  ) {}

  public async getManyForView(
    offset: number,
    limit: number,
    userId: number,
    keyword?: string
  ): Promise<ThesisForListView[]> {
    const user = await this.userService.getById(userId);

    if (user.isAdmin === IsAdmin.TRUE) {
      return (await this.getManyForAdmin(offset, limit, keyword)).map(
        ({ id, subject, startTime, endTime, state, status, creator }) => ({
          id,
          subject,
          startTime,
          endTime,
          state,
          status,
          creator: creator.convertToFastView()
        })
      );
    }

    if (user.userType === UserType.LECTURER) {
      return (await this.getManyForLecturer(userId, offset, limit, keyword)).map(
        ({ id, subject, startTime, endTime, state, status, creator }) => ({
          id,
          subject,
          startTime,
          endTime,
          state,
          status,
          creator: creator.convertToFastView()
        })
      );
    }

    if (user.userType === UserType.STUDENT) {
      return (await this.getManyForStudent(userId, offset, limit, keyword)).map(
        ({ id, subject, startTime, endTime, state, status, creator }) => ({
          id,
          subject,
          startTime,
          endTime,
          state,
          status,
          creator: creator.convertToFastView()
        })
      );
    }

    return [];
  }

  public async getAmount(loginUserId: number, keyword?: string): Promise<number> {
    const loginUser = await this.userService.getById(loginUserId);

    if (loginUser.isAdmin === IsAdmin.TRUE) {
      return this.getAmountForAdmin(keyword);
    }

    if (loginUser.userType === UserType.LECTURER) {
      return this.getAmountForLecturer(loginUserId, keyword);
    }

    if (loginUser.userType === UserType.STUDENT) {
      return this.getAmountForStudent(loginUserId, keyword);
    }

    return 0;
  }

  public async create(data: ThesisRequestBody): Promise<Thesis> {
    const { attendees, ...thesis } = data;
    this.validateThesisStateDate(thesis as Thesis);
    const thesisEntity = this.thesisRepository.create(thesis);
    thesisEntity.state = this.getThesisCurrentState(thesisEntity);
    thesisEntity.creatorId = data.creatorId;
    const thesisLecturers: ThesisLecturer[] = [];
    const thesisStudents: ThesisStudent[] = [];

    if (attendees && attendees.lecturers) {
      const { lecturers } = attendees;
      const lecturerEntities = await this.lecturerService.findByIds(lecturers);
      for (const lecturer of lecturers) {
        const lecturerEntity = lecturerEntities.find(({ id }) => id === lecturer);
        if (!lecturerEntity) {
          throw new BadRequestException(LecturerError.ERR_3);
        }

        await this.lecturerService.checkIsActive(lecturerEntity);
        thesisLecturers.push(
          this.thesisLecturerService.createEntity({
            lecturerId: lecturerEntity.id
          })
        );
      }
    }

    if (attendees && attendees.students) {
      const { students } = attendees;
      const participatedThesisStudentIds = (
        await this.thesisStudentService.getStudentParticipatedThesisByIds(students)
      ).map(({ studentId }) => studentId);
      const studentEntities = await this.studentService.findByIdsForThesis(students);
      for (const student of students) {
        const studentEntity = studentEntities.find(({ id }) => id === student);
        if (!studentEntity) {
          throw new BadRequestException(StudentError.ERR_3);
        }

        this.studentService.checkIsActive(studentEntity);
        this.studentService.checkGraduated(studentEntity);
        this.studentService.checkHasParticipatedThesis(studentEntity, participatedThesisStudentIds);
        thesisStudents.push(
          this.thesisStudentService.createEntity({
            studentId: studentEntity.id
          })
        );
      }
    }

    return this.connection.transaction(async (manager) => {
      const thesis = await manager.save(thesisEntity);
      await manager.save(
        thesisLecturers.map((lecturer) => {
          lecturer.thesisId = thesis.id;

          return lecturer;
        })
      );
      await manager.save(
        thesisStudents.map((student) => {
          student.thesisId = thesis.id;

          return student;
        })
      );

      return thesis;
    });
  }

  public async getById(id: number): Promise<Thesis> {
    const thesis = await this.thesisRepository.findOne(id, {
      relations: ['creator', 'creator.user']
    });
    if (!thesis) {
      throw new BadRequestException(ThesisError.ERR_7);
    }

    return thesis;
  }

  private async hasPermission(thesis: Thesis, user: User): Promise<boolean> {
    if (user.isAdmin === IsAdmin.TRUE) {
      if (thesis.creatorId === user.id) {
        return true;
      }
    }

    if (user.userType === UserType.LECTURER) {
      return this.thesisLecturerService.hasPermission(thesis.id, user);
    }

    if (user.userType === UserType.STUDENT) {
      return this.thesisStudentService.hasPermission(thesis.id, user);
    }

    return false;
  }

  public async isExistById(id: number): Promise<boolean> {
    return (await this.thesisRepository.count({ id })) > 0;
  }

  public async checkExistById(id: number): Promise<void> {
    if (!(await this.isExistById(id))) {
      throw new BadRequestException(ThesisError.ERR_7);
    }
  }

  public async checkPermission(thesisId: number | Thesis, userId: number | User): Promise<void> {
    let user: User;
    if (typeof userId === 'number') {
      user = await this.userService.getById(userId);
    } else {
      user = userId;
    }

    let thesis: Thesis;
    if (typeof thesisId === 'number') {
      thesis = await this.getById(thesisId);
    } else {
      thesis = thesisId;
    }

    if (!(await this.hasPermission(thesis, user))) {
      throw new BadRequestException(ThesisError.ERR_8);
    }
  }

  public async getByIdForEdit(id: number): Promise<ThesisForEdit> {
    const thesis = await this.thesisRepository.findOne({ id });
    if (!thesis) {
      throw new BadRequestException(ThesisError.ERR_7);
    }

    const thesisForEdit: ThesisForEdit = { ...thesis, lecturerAttendees: [], studentAttendees: [] };
    thesisForEdit.lecturerAttendees = await this.thesisLecturerService.getThesisLecturersForEdit(
      id
    );
    thesisForEdit.studentAttendees = await this.thesisStudentService.getThesisStudentsForEditView(
      id
    );

    return thesisForEdit;
  }

  public async updateById(id: number, data: ThesisRequestBody): Promise<void> {
    const { attendees, ...thesis } = data;
    this.validateThesisStateDate(thesis as Thesis);
    const currentThesis = await this.getById(id);
    this.checkThesisIsInactive(currentThesis.status);

    return await this.connection.transaction(async (manager) => {
      if (attendees) {
        if (attendees.lecturers) {
          await this.thesisLecturerService.updateWithTransaction(
            manager,
            currentThesis,
            attendees.lecturers
          );
        }

        if (attendees.students) {
          await this.thesisStudentService.updateWithTransaction(
            manager,
            currentThesis,
            attendees.students
          );
        }
      }

      const currentState = this.getThesisCurrentState(thesis);
      await this.handleChangeStateWithTransaction(manager, currentThesis, currentState);
      await manager.update(ThesisEntity, { id }, { ...thesis, state: currentState });
    });
  }

  public getThesisCurrentState({
    startTime,
    endTime,
    lecturerTopicRegister,
    studentTopicRegister,
    progressReport,
    review,
    defense
  }: Thesis | ThesisRequestBody): ThesisState {
    const currentDate = moment.utc();
    if (currentDate.isBefore(startTime, 'day')) {
      return ThesisState.NOT_START;
    }

    if (currentDate.isAfter(endTime, 'day')) {
      return ThesisState.FINISH;
    }

    if (currentDate.isBetween(startTime, lecturerTopicRegister, 'day', '[]')) {
      return ThesisState.LECTURER_TOPIC_REGISTER;
    }

    if (currentDate.isBetween(lecturerTopicRegister, studentTopicRegister, 'day', '(]')) {
      return ThesisState.STUDENT_TOPIC_REGISTER;
    }

    if (currentDate.isBetween(studentTopicRegister, progressReport, 'day', '(]')) {
      return ThesisState.PROGRESS_REPORT;
    }

    if (currentDate.isBetween(progressReport, review, 'day', '(]')) {
      return ThesisState.REVIEW;
    }

    if (currentDate.isBetween(review, defense, 'day', '[]')) {
      return ThesisState.DEFENSE;
    }

    return ThesisState.RESULT;
  }

  @Cron('0 0 * * *', { timeZone: 'UTC' })
  public async switchStateCron(): Promise<void> {
    Logger.log('Switch thesis state...');
    const current = moment.utc();
    const theses = await this.thesisRepository.find({
      where: {
        state: Not(ThesisState.FINISH),
        startTime: LessThanOrEqual(current.toISOString()),
        endTime: MoreThanOrEqual(current.toISOString())
      },
      cache: true
    });

    await this.connection.transaction(async (manager) => {
      for (const thesis of theses) {
        const currentState = this.getThesisCurrentState(thesis);
        await this.handleChangeStateWithTransaction(manager, thesis, currentState);
        thesis.state = currentState;
      }

      await manager.save(ThesisEntity, theses);
      Logger.log('Switch thesis state... Done!');
    });
  }

  public async deleteById(id: number): Promise<void> {
    await this.checkExistById(id);
    await this.connection.transaction(async (manager) => {
      const deletedAt = new Date();
      await this.thesisLecturerService.deleteByThesisIdWithTransaction(manager, id, deletedAt);
      await this.thesisStudentService.deleteByThesisIdWithTransaction(manager, id, deletedAt);
      await this.topicService.deleteByThesisIdWithTransaction(manager, id, deletedAt);
      await this.councilService.deleteByThesisIdWithTransaction(manager, id, deletedAt);
      await manager.update(ThesisEntity, { id }, { deletedAt });
    });
  }

  public async switchStatus(id: number): Promise<ThesisForView> {
    const thesis = await this.getById(id);
    if (thesis.status === ThesisStatus.INACTIVE) {
      thesis.status = ThesisStatus.ACTIVE;
    } else {
      thesis.status = ThesisStatus.INACTIVE;
    }

    await this.thesisRepository.save(thesis);

    return this.convertForView(thesis);
  }

  private async getManyForAdmin(
    offset: number,
    limit: number,
    keyword?: string
  ): Promise<Thesis[]> {
    let conditions: FindConditions<Thesis> = {};
    if (keyword) {
      conditions = this.getSearchConditions(conditions, keyword);
    }

    return this.thesisRepository.find({
      relations: ['creator', 'creator.user'],
      where: conditions,
      skip: offset,
      take: limit,
      order: {
        status: 'DESC'
      },
      cache: true
    });
  }

  private async getManyForLecturer(
    userId: number,
    offset: number,
    limit: number,
    keyword?: string
  ): Promise<Thesis[]> {
    let conditions: FindConditions<Thesis> = {};
    if (keyword) {
      conditions = this.getSearchConditions(conditions, keyword);
    }

    return this.thesisRepository.find({
      join: { alias: 't', innerJoin: { lecturers: 't.lecturers' } },
      relations: ['creator', 'creator.user'],
      where: (qb: SelectQueryBuilder<Thesis>) => {
        qb.where(`lecturers.${ThesisLecturerColumn.LECTURER_ID} = :userId`, { userId }).where(
          conditions
        );
      },
      skip: offset,
      take: limit,
      order: {
        status: 'DESC'
      },
      cache: true
    });
  }

  private async getManyForStudent(
    userId: number,
    offset: number,
    limit: number,
    keyword?: string
  ): Promise<Thesis[]> {
    let conditions: FindConditions<Thesis> = {};
    if (keyword) {
      conditions = this.getSearchConditions(conditions, keyword);
    }

    return this.thesisRepository.find({
      relations: ['creator', 'creator.user'],
      join: { alias: 't', innerJoin: { students: 't.students' } },
      where: (qb: SelectQueryBuilder<Thesis>) => {
        qb.where(`students.${ThesisStudentColumn.STUDENT_ID} = :userId`, { userId }).where(
          conditions
        );
      },
      skip: offset,
      take: limit,
      order: {
        status: 'DESC'
      },
      cache: true
    });
  }

  private validateThesisStateDate({
    startTime,
    endTime,
    lecturerTopicRegister,
    studentTopicRegister,
    progressReport,
    review,
    defense
  }: Thesis): void {
    if (!moment(startTime).isBefore(endTime, 'day')) {
      throw new BadRequestException(ThesisError.ERR_6);
    }

    if (
      !this.isValidStateDate(
        moment(lecturerTopicRegister),
        moment(startTime),
        moment(endTime),
        undefined,
        moment(studentTopicRegister)
      )
    ) {
      throw new BadRequestException(ThesisError.ERR_1);
    }

    if (
      !this.isValidStateDate(
        moment(studentTopicRegister),
        moment(startTime),
        moment(endTime),
        moment(lecturerTopicRegister),
        moment(progressReport)
      )
    ) {
      throw new BadRequestException(ThesisError.ERR_2);
    }

    if (
      !this.isValidStateDate(
        moment(progressReport),
        moment(startTime),
        moment(endTime),
        moment(studentTopicRegister),
        moment(review)
      )
    ) {
      throw new BadRequestException(ThesisError.ERR_3);
    }

    if (
      !this.isValidStateDate(
        moment(review),
        moment(startTime),
        moment(endTime),
        moment(progressReport),
        moment(defense)
      )
    ) {
      throw new BadRequestException(ThesisError.ERR_4);
    }

    if (
      !this.isValidStateDate(
        moment(defense),
        moment(startTime),
        moment(endTime),
        moment(progressReport)
      )
    ) {
      throw new BadRequestException(ThesisError.ERR_5);
    }
  }

  private isValidStateDate(
    date: Moment,
    startDate: Moment,
    endDate: Moment,
    startState?: Moment,
    endState?: Moment
  ): boolean {
    const beginRange = startState
      ? date.isSameOrBefore(startState, 'day')
      : date.isBefore(startDate, 'day');
    const endRange = endState
      ? date.isSameOrAfter(endState.endOf('day'), 'day')
      : date.isAfter(endDate.endOf('day'), 'day');

    return !(beginRange || endRange);
  }

  private getSearchConditions(
    initConditions: FindConditions<Thesis>,
    keyword: string
  ): FindConditions<Thesis> {
    return { ...initConditions, subject: Like(`%${keyword}%`) };
  }

  private async getAmountForAdmin(keyword?: string): Promise<number> {
    let conditions: FindConditions<Thesis> = {};
    if (keyword) {
      conditions = this.getSearchConditions(conditions, keyword);
    }

    return this.thesisRepository.count(conditions);
  }

  private async getAmountForLecturer(userId: number, keyword?: string): Promise<number> {
    let conditions: FindConditions<Thesis> = {};
    if (keyword) {
      conditions = this.getSearchConditions(conditions, keyword);
    }

    return this.thesisRepository.count({
      join: { alias: 't', innerJoin: { lecturers: 't.lecturers' } },
      where: (qb: SelectQueryBuilder<Thesis>) => {
        qb.where(`lecturers.${ThesisLecturerColumn.LECTURER_ID} = :userId`, { userId }).where(
          conditions
        );
      },
      cache: true
    });
  }

  private async getAmountForStudent(userId: number, keyword?: string): Promise<number> {
    let conditions: FindConditions<Thesis> = {};
    if (keyword) {
      conditions = this.getSearchConditions(conditions, keyword);
    }

    return this.thesisRepository.count({
      join: { alias: 't', innerJoin: { students: 't.students' } },
      where: (qb: SelectQueryBuilder<Thesis>) => {
        qb.where(`students.${ThesisStudentColumn.STUDENT_ID} = :userId`, { userId }).where(
          conditions
        );
      },
      cache: true
    });
  }

  private async handleChangeStateWithTransaction(
    manager: EntityManager,
    thesis: Thesis,
    state: ThesisState
  ): Promise<void> {
    if (state !== ThesisState.LECTURER_TOPIC_REGISTER) {
      await this.topicService.cancelTopicsByThesisIdWithTransaction(manager, thesis.id);
    }

    if (state !== ThesisState.STUDENT_TOPIC_REGISTER) {
      await this.topicService.rejectTopicRegisterByThesisIdWithTransaction(manager, thesis.id);
      await this.topicService.disableRegisterStatusByThesisIdWithTransaction(manager, thesis.id);
    }

    if (state === ThesisState.STUDENT_TOPIC_REGISTER) {
      await this.topicService.enableRegisterByThesisIdWithTransaction(manager, thesis.id);
    }

    if (state === ThesisState.REVIEW) {
      await this.topicService.createReviewWithTransaction(manager, thesis);
    }

    if (state === ThesisState.DEFENSE) {
      await this.topicService.createDefenseWithTransaction(manager, thesis);
      await this.topicService.createResultWithTransaction(manager, thesis);
    }
  }

  public async isCreatorActiveThesis(userId: number): Promise<boolean> {
    return (
      (await this.thesisRepository.count({
        status: ThesisStatus.ACTIVE,
        creatorId: userId
      })) > 0
    );
  }

  public checkThesisIsActive(status: ThesisStatus): void {
    if (status === ThesisStatus.INACTIVE) {
      throw new BadRequestException(ThesisError.ERR_9);
    }
  }

  public checkThesisIsInactive(status: ThesisStatus): void {
    if (status === ThesisStatus.ACTIVE) {
      throw new BadRequestException(ThesisError.ERR_10);
    }
  }

  public convertForView(thesis: Thesis): ThesisForView {
    const { creator, ...remain } = thesis;

    return {
      ...remain,
      creator: creator.convertToFastView()
    };
  }
}
