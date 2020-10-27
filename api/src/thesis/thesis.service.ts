import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import moment, { Moment } from 'moment';
import {
  Connection,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  Repository
} from 'typeorm';

import { NOT_DELETE_CONDITION } from '../common/common.resource';
import { LecturerError } from '../lecturer/lecturer.resource';
import { LecturerService } from '../lecturer/lecturer.service';
import { StudentError } from '../student/student.resource';
import { StudentService } from '../student/student.service';
import { User } from '../user/user.interface';
import { IsAdmin, UserType } from '../user/user.resource';
import { UserService } from '../user/user.service';
import { ThesisLecturer } from './thesis-lecturer/thesis-lecturer.interface';
import { ThesisLecturerService } from './thesis-lecturer/thesis-lecturer.service';
import { ThesisStudent } from './thesis-student/thesis-student.interface';
import { ThesisStudentService } from './thesis-student/thesis-student.service';
import { ThesisEntity } from './thesis.entity';
import { Thesis, ThesisForEdit, ThesisRequestBody } from './thesis.interface';
import { ThesisError, ThesisState, ThesisStatus } from './thesis.resource';

@Injectable()
export class ThesisService {
  constructor(
    @InjectRepository(ThesisEntity) private readonly thesisRepository: Repository<Thesis>,
    private readonly connection: Connection,
    private readonly lecturerService: LecturerService,
    private readonly studentService: StudentService,
    private readonly thesisStudentService: ThesisStudentService,
    private readonly thesisLecturerService: ThesisLecturerService,
    private readonly userService: UserService
  ) {}

  public async getMany(offset: number, limit: number, loginUserId: number): Promise<Thesis[]> {
    const user = await this.userService.findById(loginUserId);

    if (user.isAdmin === IsAdmin.TRUE) {
      return this.thesisRepository.find({
        relations: { creator: { user } },
        where: { ...NOT_DELETE_CONDITION },
        skip: offset,
        take: limit,
        cache: true
      });
    }

    let conditions: FindOptionsWhere<Thesis> = { ...NOT_DELETE_CONDITION };
    if (user.userType === UserType.LECTURER) {
      conditions = { lecturers: { lecturer: { id: user.id } } };
    }

    if (user.userType === UserType.STUDENT) {
      conditions = { students: { studentId: user.id } };
    }

    return this.thesisRepository.find({
      relations: { creator: { user: {} } },
      where: conditions,
      skip: offset,
      take: limit,
      cache: true
    });
  }

  public async getAmount(): Promise<number> {
    return this.thesisRepository.count();
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

  public async getById(id: number): Promise<Thesis> {
    const thesis = await this.thesisRepository.findOne(id, {
      relations: { creator: { user: {} } },
      where: { ...NOT_DELETE_CONDITION }
    });
    if (!thesis) {
      throw new BadRequestException(ThesisError.ERR_7);
    }

    thesis.lecturers = await this.thesisLecturerService.getThesisLecturersForView(thesis.id);
    thesis.students = await this.thesisStudentService.getThesisStudentsForView(thesis.id);

    return thesis;
  }

  public async hasPermission(id: number, loginUser: User): Promise<boolean> {
    if (loginUser.isAdmin === IsAdmin.TRUE) {
      return true;
    }

    if (loginUser.userType === UserType.LECTURER) {
      return (
        (await this.thesisRepository.count({
          id,
          lecturers: { lecturer: { id: loginUser.id, user: { ...NOT_DELETE_CONDITION } } }
        })) > 0
      );
    }

    if (loginUser.userType === UserType.STUDENT) {
      return this.thesisStudentService.isThesisExistById(id, loginUser);
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

  public async checkThesisPermission(thesisId: number, loginUser: User): Promise<void> {
    if (!(await this.hasPermission(thesisId, loginUser))) {
      throw new BadRequestException(ThesisError.ERR_8);
    }
  }

  public async getByIdForEdit(id: number): Promise<ThesisForEdit> {
    const thesis = await this.thesisRepository.findOne({ id, ...NOT_DELETE_CONDITION });
    if (!thesis) {
      throw new BadRequestException(ThesisError.ERR_7);
    }

    const thesisForEdit: ThesisForEdit = { ...thesis, lecturerAttendees: [], studentAttendees: [] };
    thesisForEdit.lecturerAttendees = await this.thesisLecturerService.getThesisLecturersForEditView(
      id
    );
    thesisForEdit.studentAttendees = await this.thesisStudentService.getThesisStudentsForEditView(
      id
    );

    return thesisForEdit;
  }

  public async updateById(id: number, data: ThesisRequestBody): Promise<Thesis> {
    const { attendees, ...thesis } = data;
    this.validateThesisStateDate(thesis as Thesis);
    const currentThesis = await this.thesisRepository.findOne({ id, ...NOT_DELETE_CONDITION });

    if (!currentThesis) {
      throw new BadRequestException(ThesisError.ERR_7);
    }

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

      if (thesis.subject) {
        currentThesis.subject = thesis.subject;
      }

      if (thesis.startTime) {
        currentThesis.startTime = thesis.startTime;
      }

      if (thesis.endTime) {
        currentThesis.endTime = thesis.endTime;
      }

      if (thesis.lecturerTopicRegister) {
        currentThesis.lecturerTopicRegister = thesis.lecturerTopicRegister;
      }

      if (thesis.studentTopicRegister) {
        currentThesis.studentTopicRegister = thesis.studentTopicRegister;
      }

      if (thesis.progressReport) {
        currentThesis.progressReport = thesis.progressReport;
      }

      if (thesis.review) {
        currentThesis.review = thesis.review;
      }

      if (thesis.defense) {
        currentThesis.defense = thesis.defense;
      }

      currentThesis.state = this.getThesisCurrentState(currentThesis);
      return await manager.save(currentThesis);
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
  }: Thesis): ThesisState {
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

    if (currentDate.isBetween(studentTopicRegister, lecturerTopicRegister, 'day', '[)')) {
      return ThesisState.STUDENT_TOPIC_REGISTER;
    }

    if (currentDate.isBetween(studentTopicRegister, progressReport, 'day', '[)')) {
      return ThesisState.PROGRESS_REPORT;
    }

    if (currentDate.isBetween(progressReport, review, 'day', '[)')) {
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
        ...NOT_DELETE_CONDITION
      },
      cache: true
    });

    for (const thesis of theses) {
      thesis.state = this.getThesisCurrentState(thesis);
    }

    await this.thesisRepository.save(theses);

    Logger.log('Switch thesis state... Done!');
  }

  public async deleteById(id: number): Promise<void> {
    await this.checkThesisExistById(id);
    await this.connection.transaction(async (manager) => {
      const deletedAt = new Date();
      await this.thesisLecturerService.deleteByThesisIdWithTransaction(manager, id, deletedAt);
      await this.thesisStudentService.deleteByThesisIdWithTransaction(manager, id, deletedAt);
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
}
