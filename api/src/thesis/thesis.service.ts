import { BadRequestException, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import moment, { Moment } from 'moment';
import {
  Connection,
  EntityManager,
  FindOptionsWhere,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Not,
  Repository
} from 'typeorm';

import { notDeleteCondition } from '../common/common.resource';
import { LecturerError } from '../lecturer/lecturer.resource';
import { LecturerService } from '../lecturer/lecturer.service';
import { StudentError } from '../student/student.resource';
import { StudentService } from '../student/student.service';
import { TopicService } from '../topic/topic.service';
import { IsAdmin, UserType } from '../user/user.resource';
import { UserService } from '../user/user.service';
import { User } from '../user/user.type';
import { ThesisLecturerService } from './thesis-lecturer/thesis-lecturer.service';
import { ThesisLecturer } from './thesis-lecturer/thesis-lecturer.type';
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
    private readonly topicService: TopicService
  ) {}

  public async getManyForView(
    offset: number,
    limit: number,
    loginUserId: number,
    keyword?: string
  ): Promise<ThesisForListView[]> {
    const loginUser = await this.userService.findById(loginUserId);

    if (loginUser.isAdmin === IsAdmin.TRUE) {
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

    if (loginUser.userType === UserType.LECTURER) {
      return (await this.getManyForLecturer(loginUserId, offset, limit, keyword)).map(
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

    if (loginUser.userType === UserType.STUDENT) {
      return (await this.getManyForStudent(loginUserId, offset, limit, keyword)).map(
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
    const loginUser = await this.userService.findById(loginUserId);

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
    thesisEntity.creator = await this.lecturerService.getById(data.creatorId);

    if (attendees && attendees.lecturers) {
      const { lecturers } = attendees;
      const lecturerEntities = await this.lecturerService.findByIds(lecturers);
      const thesisLecturers: ThesisLecturer[] = [];
      for (const lecturer of lecturers) {
        const lecturerEntity = lecturerEntities.find(({ id }) => id === lecturer);
        if (!lecturerEntity) {
          throw new BadRequestException(LecturerError.ERR_3);
        }

        await this.lecturerService.checkIsActive(lecturerEntity);
        thesisLecturers.push(
          this.thesisLecturerService.createEntity({
            thesisId: thesisEntity.id,
            lecturerId: lecturerEntity.id
          })
        );
      }

      thesisEntity.lecturers = thesisLecturers;
    }

    if (attendees && attendees.students) {
      const { students } = attendees;
      const participatedThesisStudentIds = (
        await this.thesisStudentService.getStudentParticipatedThesisByIds(students)
      ).map(({ studentId }) => studentId);
      const studentEntities = await this.studentService.findByIdsForThesis(students);
      const thesisStudents: ThesisStudent[] = [];
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
            thesisId: thesisEntity.id,
            studentId: studentEntity.id
          })
        );
      }

      thesisEntity.students = thesisStudents;
    }

    return await this.thesisRepository.save(thesisEntity);
  }

  public async getById(id: number): Promise<Thesis> {
    const thesis = await this.thesisRepository.findOne(id, {
      relations: { creator: { user: {} } },
      where: { ...notDeleteCondition }
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

  public async isThesisExistById(id: number): Promise<boolean> {
    return (await this.thesisRepository.count({ id })) > 0;
  }

  public async checkThesisExistById(id: number): Promise<void> {
    if (!(await this.isThesisExistById(id))) {
      throw new BadRequestException(ThesisError.ERR_7);
    }
  }

  public async checkPermission(thesisId: number | Thesis, userId: number | User): Promise<void> {
    let user: User;
    if (typeof userId === 'number') {
      user = await this.userService.findById(userId);
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
    const thesis = await this.thesisRepository.findOne({ id, ...notDeleteCondition });
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
        endTime: MoreThanOrEqual(current.toISOString()),
        ...notDeleteCondition
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
    await this.checkThesisExistById(id);
    await this.connection.transaction(async (manager) => {
      const deletedAt = new Date();
      await this.thesisLecturerService.deleteByThesisIdWithTransaction(manager, id, deletedAt);
      await this.thesisStudentService.deleteByThesisIdWithTransaction(manager, id, deletedAt);
      await this.topicService.deleteByThesisIdWithTransaction(manager, id, deletedAt);
      await manager.update(ThesisEntity, { id }, { deletedAt });
    });
  }

  public async switchStatus(id: number): Promise<ThesisStatus> {
    const thesis = await this.getById(id);
    if (thesis.status === ThesisStatus.INACTIVE) {
      await this.thesisRepository.update({ id }, { status: ThesisStatus.ACTIVE });
      return ThesisStatus.ACTIVE;
    } else {
      await this.thesisRepository.update({ id }, { status: ThesisStatus.INACTIVE });
      return ThesisStatus.INACTIVE;
    }
  }

  private async getManyForAdmin(
    offset: number,
    limit: number,
    keyword?: string
  ): Promise<Thesis[]> {
    let conditions: FindOptionsWhere<Thesis> = { ...notDeleteCondition };
    if (keyword) {
      conditions = this.getSearchConditions(conditions, keyword);
    }

    return this.thesisRepository.find({
      relations: { creator: { user: {} } },
      where: conditions,
      skip: offset,
      take: limit,
      cache: true
    });
  }

  private async getManyForLecturer(
    userId: number,
    offset: number,
    limit: number,
    keyword?: string
  ): Promise<Thesis[]> {
    let conditions: FindOptionsWhere<Thesis> = {
      ...notDeleteCondition,
      lecturers: { lecturer: { id: userId } }
    };
    if (keyword) {
      conditions = this.getSearchConditions(conditions, keyword);
    }

    return this.thesisRepository.find({
      relations: { creator: { user: {} } },
      where: conditions,
      skip: offset,
      take: limit,
      cache: true
    });
  }

  private async getManyForStudent(
    userId: number,
    offset: number,
    limit: number,
    keyword?: string
  ): Promise<Thesis[]> {
    let conditions: FindOptionsWhere<Thesis> = {
      ...notDeleteCondition,
      students: { student: { id: userId } }
    };
    if (keyword) {
      conditions = this.getSearchConditions(conditions, keyword);
    }

    return this.thesisRepository.find({
      relations: { creator: { user: {} } },
      where: conditions,
      skip: offset,
      take: limit,
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
    initConditions: FindOptionsWhere<Thesis>,
    keyword: string
  ): FindOptionsWhere<Thesis> {
    return { ...initConditions, subject: Like(`%${keyword}%`) };
  }

  private async getAmountForAdmin(keyword?: string): Promise<number> {
    let conditions: FindOptionsWhere<Thesis> = { ...notDeleteCondition };
    if (keyword) {
      conditions = this.getSearchConditions(conditions, keyword);
    }

    return this.thesisRepository.count(conditions);
  }

  private async getAmountForLecturer(userId: number, keyword?: string): Promise<number> {
    let conditions: FindOptionsWhere<Thesis> = {
      ...notDeleteCondition,
      lecturers: { lecturer: { id: userId } }
    };
    if (keyword) {
      conditions = this.getSearchConditions(conditions, keyword);
    }

    return this.thesisRepository.count(conditions);
  }

  private async getAmountForStudent(userId: number, keyword?: string): Promise<number> {
    let conditions: FindOptionsWhere<Thesis> = {
      ...notDeleteCondition,
      students: { student: { id: userId } }
    };
    if (keyword) {
      conditions = this.getSearchConditions(conditions, keyword);
    }

    return this.thesisRepository.count(conditions);
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

    if (state === ThesisState.REVIEW) {
      await this.topicService.createReviewWithTransaction(manager, thesis);
    }
  }

  public async getByIdForView(id: number): Promise<ThesisForView> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { deletedAt, creator, ...remain } = await this.getById(id);

    return {
      ...remain,
      creator: creator.convertToFastView()
    };
  }

  public async isCreatorActiveThesis(userId: number): Promise<boolean> {
    return (
      (await this.thesisRepository.count({
        ...notDeleteCondition,
        status: ThesisStatus.ACTIVE,
        creatorId: userId
      })) > 0
    );
  }

  public checkThesisIsActive({ status }: Thesis): void {
    if (status === ThesisStatus.INACTIVE) {
      throw new BadRequestException(ThesisError.ERR_9);
    }
  }
}
