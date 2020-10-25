import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
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
import { ThesisError, ThesisState } from './thesis.resource';

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
        skip: offset,
        take: limit,
        cache: true
      });
    }

    let conditions: FindOptionsWhere<Thesis> = {};
    if (user.userType === UserType.LECTURER) {
      conditions = { lecturers: { lecturer: { id: user.id } } };
    }

    if (user.userType === UserType.STUDENT) {
      conditions = { students: { studentId: user.id } };
    }

    return this.thesisRepository.find({
      relations: { creator: { user } },
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
    thesisEntity.creator = await this.lecturerService.findById(data.creatorId);

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

  private validateThesisStateDate(thesis: Thesis): void {
    if (!this.isValidStartAndEndTime(thesis)) {
      throw new BadRequestException(ThesisError.ERR_6);
    }

    if (!this.isValidLecturerTopicRegister(thesis)) {
      throw new BadRequestException(ThesisError.ERR_1);
    }

    if (!this.isValidStudentTopicRegister(thesis)) {
      throw new BadRequestException(ThesisError.ERR_2);
    }

    if (!this.isValidProgressReport(thesis)) {
      throw new BadRequestException(ThesisError.ERR_3);
    }

    if (!this.isValidReview(thesis)) {
      throw new BadRequestException(ThesisError.ERR_4);
    }

    if (!this.isValidDefense(thesis)) {
      throw new BadRequestException(ThesisError.ERR_5);
    }
  }

  private isValidStartAndEndTime(thesis: Thesis): boolean {
    const { startTime, endTime } = thesis;

    return !(moment.utc(startTime).unix() > moment.utc(endTime).unix());
  }

  private isValidLecturerTopicRegister(thesis: Thesis): boolean {
    const {
      lecturerTopicRegister,
      studentTopicRegister,

      startTime
    } = thesis;

    return !(
      moment.utc(lecturerTopicRegister).unix() < moment.utc(startTime).unix() ||
      moment.utc(lecturerTopicRegister).unix() >= moment.utc(studentTopicRegister).unix()
    );
  }

  private isValidStudentTopicRegister(thesis: Thesis): boolean {
    const { lecturerTopicRegister, studentTopicRegister, progressReport } = thesis;

    return !(
      moment.utc(studentTopicRegister).unix() < moment.utc(lecturerTopicRegister).unix() ||
      moment.utc(studentTopicRegister).unix() >= moment.utc(progressReport).unix()
    );
  }

  private isValidProgressReport(thesis: Thesis): boolean {
    const { studentTopicRegister, progressReport, review } = thesis;

    return !(
      moment.utc(progressReport).unix() < moment.utc(studentTopicRegister).unix() ||
      moment.utc(progressReport).unix() >= moment.utc(review).unix()
    );
  }

  private isValidReview(thesis: Thesis): boolean {
    const { progressReport, review, defense } = thesis;

    return !(
      moment.utc(review).unix() < moment.utc(progressReport).unix() ||
      moment.utc(review).unix() >= moment.utc(defense).unix()
    );
  }

  private isValidDefense(thesis: Thesis): boolean {
    const { review, defense, endTime } = thesis;

    return !(
      moment.utc(defense).unix() >= moment.utc(endTime).unix() ||
      moment.utc(defense).unix() < moment.utc(review).unix()
    );
  }

  public async getById(id: number, loginUserId: number): Promise<Thesis> {
    const user = await this.userService.findById(loginUserId);
    let conditions: FindOptionsWhere<Thesis> = {};
    if (user.isAdmin !== IsAdmin.TRUE) {
      if (user.userType === UserType.LECTURER) {
        conditions = { lecturers: { lecturer: { id: user.id } } };
      }

      if (user.userType === UserType.STUDENT) {
        conditions = { students: { studentId: user.id } };
      }
    }

    const thesis = await this.thesisRepository.findOne(id, {
      relations: { creator: { user } },
      where: conditions,
      cache: true
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
    const thesis = await this.thesisRepository.findOne(id, {
      cache: true
    });
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
    const currentThesis = await this.thesisRepository.findOne(id, { cache: true });

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

    if (currentDate.isBetween(startTime, lecturerTopicRegister, 'day')) {
      return ThesisState.LECTURER_TOPIC_REGISTER;
    }

    if (currentDate.isBetween(lecturerTopicRegister, studentTopicRegister, 'day')) {
      return ThesisState.STUDENT_TOPIC_REGISTER;
    }

    if (currentDate.isBetween(studentTopicRegister, progressReport, 'day')) {
      return ThesisState.PROGRESS_REPORT;
    }

    if (currentDate.isBetween(progressReport, review, 'day')) {
      return ThesisState.REVIEW;
    }

    if (currentDate.isBetween(review, defense, 'day')) {
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

    for (const thesis of theses) {
      thesis.state = this.getThesisCurrentState(thesis);
    }

    await this.thesisRepository.save(theses);

    Logger.log('Switch thesis state... Done!');
  }

  public async deleteById(id: number): Promise<void> {
    await this.checkThesisExistById(id);
    await this.connection.transaction(async (manager) => {
      await this.thesisLecturerService.deleteWithTransaction(manager, id);
      await this.thesisStudentService.deleteWithTransaction(manager, id);
      await manager.delete(ThesisEntity, id);
    });
  }
}
