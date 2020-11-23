import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, EntityManager, Not, Repository, SelectQueryBuilder } from 'typeorm';

import { Lecturer } from '../lecturer/lecturer.type';
import { ThesisStudentService } from '../thesis/thesis-student/thesis-student.service';
import { UserColumn, UserError, UserStatus, UserType } from '../user/user.resource';
import { UserService } from '../user/user.service';
import { UserRequestBody } from '../user/user.type';
import { StudentEntity } from './student.entity';
import { IsGraduate, StudentColumn, StudentError, StudentSearchType } from './student.resource';
import {
  Student,
  StudentForListView,
  StudentRequestBody,
  StudentSearchAttendee
} from './student.type';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentEntity) private readonly studentRepository: Repository<Student>,
    private readonly userService: UserService,
    private readonly thesisStudentService: ThesisStudentService,
    private readonly connection: Connection
  ) {}

  public async getManyForView(
    offset: number,
    limit: number,
    keyword?: string
  ): Promise<StudentForListView[]> {
    return (
      await this.studentRepository.find({
        join: { alias: 's', innerJoinAndSelect: { user: 's.user' } },
        where: keyword ? this.getSearchConditions(keyword) : {},
        skip: offset,
        take: limit,
        cache: true
      })
    ).map(({ id, studentId, user: { username, firstname, lastname, gender, status } }) => ({
      id,
      studentId,
      username,
      firstname,
      lastname,
      gender,
      status
    }));
  }

  public async getById(id: number): Promise<Student> {
    const student: Student | undefined = await this.studentRepository.findOne(id, {
      relations: ['user'],
      cache: true
    });

    if (!student) {
      throw new BadRequestException(StudentError.ERR_3);
    }

    return student;
  }

  public async isStudentExistById(id: number): Promise<boolean> {
    return (await this.studentRepository.count({ id })) > 0;
  }

  public async checkStudentExistById(id: number): Promise<void> {
    if (!(await this.isStudentExistById(id))) {
      throw new BadRequestException(StudentError.ERR_3);
    }
  }

  public async checkStudentNotExistByStudentId(studentId: string, userId?: number): Promise<void> {
    if (await this.isStudentExistByStudentId(studentId, userId)) {
      throw new BadRequestException(StudentError.ERR_2);
    }
  }

  public async isStudentExistByStudentId(studentId: string, userId?: number): Promise<boolean> {
    return (
      (await this.studentRepository.count({
        id: Not(userId || 0),
        studentId
      })) > 0
    );
  }

  public async create(
    userBody: UserRequestBody,
    studentBody?: StudentRequestBody
  ): Promise<Student> {
    const userEntity = await this.userService.createUser(userBody);
    userEntity.userType = UserType.STUDENT;

    let studentEntity: Student;
    if (studentBody) {
      if (studentBody.studentId) {
        await this.checkStudentNotExistByStudentId(studentBody.studentId);
      }

      studentEntity = this.studentRepository.create(studentBody);
    } else {
      studentEntity = this.studentRepository.create({});
    }

    studentEntity.user = userEntity;
    return this.studentRepository.save(studentEntity);
  }

  public async updateById(
    id: number,
    userBody: UserRequestBody,
    studentBody: StudentRequestBody
  ): Promise<void> {
    if (!userBody && !studentBody) {
      return;
    }

    const currentStudent = await this.getById(id);
    if (userBody) {
      if (
        userBody.status === UserStatus.INACTIVE &&
        (await this.thesisStudentService.isParticipatedByUserId(id))
      ) {
        throw new BadRequestException(StudentError.ERR_6);
      }

      currentStudent.user = await this.userService.updateById(currentStudent.user, userBody);
    }

    if (studentBody) {
      const { studentId, studentClass, schoolYear, isGraduate } = studentBody;
      if (studentId && studentId !== currentStudent.studentId) {
        await this.checkStudentNotExistByStudentId(studentId, id);
        currentStudent.studentId = studentId;
      }

      if (studentClass) {
        currentStudent.studentClass = studentClass;
      }

      if (schoolYear) {
        currentStudent.schoolYear = schoolYear;
      }

      if (isGraduate) {
        currentStudent.isGraduate = isGraduate;
      }
    }

    await this.studentRepository.save(currentStudent);
  }

  public async deleteById(id: number): Promise<void> {
    const student = await this.getById(id);
    const deletedAt = new Date();
    if (await this.thesisStudentService.isParticipatedByUserId(id)) {
      throw new BadRequestException(StudentError.ERR_6);
    }

    await this.connection.transaction(async (manager) => {
      await this.thesisStudentService.deleteByStudentIdWithTransaction(
        manager,
        student.id,
        deletedAt
      );
      student.user.deletedAt = deletedAt;
      student.deletedAt = deletedAt;
      await manager.save(student);
    });
  }

  public async getStudentAmount(keyword?: string): Promise<number> {
    return this.studentRepository.count({
      join: { alias: 's', innerJoin: { user: 's.user' } },
      where: keyword ? this.getSearchConditions(keyword) : {},
      cache: true
    });
  }

  public async searchAttendees(
    keyword?: string,
    searchTypes?: StudentSearchType[]
  ): Promise<StudentSearchAttendee[]> {
    if (!keyword || !searchTypes || searchTypes.length === 0) {
      return [];
    }

    let students = await this.studentRepository.find({
      join: { alias: 's', innerJoinAndSelect: { user: 's.user' } },
      where: (qb: SelectQueryBuilder<Student>) => {
        const conditions: string[] = [];
        const parameters: Record<string, any> = {};
        if (searchTypes && searchTypes.includes(StudentSearchType.STUDENT_ID)) {
          conditions.push(`s.${StudentColumn.STUDENT_ID} LIKE :studentId`);
          parameters.studentId = `%${keyword}%`;
        }

        if (searchTypes && searchTypes.includes(StudentSearchType.STUDENT_CLASS)) {
          conditions.push(`s.${StudentColumn.STUDENT_CLASS} LIKE :studentClass`);
          parameters.studentClass = `%${keyword}%`;
        }

        if (searchTypes && searchTypes.includes(StudentSearchType.SCHOOL_YEAR)) {
          conditions.push(`s.${StudentColumn.SCHOOL_YEAR} LIKE :schoolYear`);
          parameters.schoolYear = `%${keyword}%`;
        }

        if (searchTypes.includes(StudentSearchType.FULL_NAME)) {
          conditions.push(`user.${UserColumn.FIRSTNAME} LIKE :firstname`);
          conditions.push(`user.${UserColumn.LASTNAME} LIKE :lastname`);
          parameters.firstname = `%${keyword}%`;
          parameters.lastname = `%${keyword}%`;
        }

        qb.where(`user.${UserColumn.STATUS} = :status`, { status: UserStatus.ACTIVE })
          .andWhere(`s.${StudentColumn.IS_GRADUATE} = :isGraduate`, {
            isGraduate: IsGraduate.FALSE
          })
          .andWhere(conditions.join(' OR '), parameters);
      },
      cache: true
    });
    const studentIds = students.map(({ id }) => id);
    const participatedThesisStudentIds = (
      await this.thesisStudentService.getStudentParticipatedThesisByIds(studentIds)
    ).map(({ studentId }) => studentId);
    students = students.filter(({ id }) => !participatedThesisStudentIds.includes(id));

    return students.map(
      ({ id, user: { firstname, lastname }, studentId, schoolYear, studentClass }) => ({
        id,
        attendeeId: studentId,
        fullName: `${lastname} ${firstname}`,
        schoolYear,
        studentClass
      })
    );
  }

  public async findByIdsForThesis(ids: number[]): Promise<Student[]> {
    return await this.studentRepository.findByIds(ids, {
      relations: ['user'],
      where: {},
      cache: true
    });
  }

  public async findByIdsWithTransaction(manager: EntityManager, ids: number[]): Promise<Student[]> {
    return await manager.findByIds(StudentEntity, ids, {
      relations: ['user'],
      where: {},
      cache: true
    });
  }

  public generateErrorInfo({ user, studentId }: Student): string {
    const { firstname, lastname } = user;

    return `${lastname} ${firstname} (${studentId})`;
  }

  public checkIsActive(student: Student): void {
    const userStatus = student.user.status;
    if (userStatus === UserStatus.INACTIVE) {
      throw new BadRequestException(UserError.ERR_9.replace('%s', this.generateErrorInfo(student)));
    }
  }

  public checkHasParticipatedThesis(
    student: Student,
    participatedThesisStudentIds: number[]
  ): void {
    const hasParticipated = participatedThesisStudentIds.includes(student.id);
    if (hasParticipated) {
      throw new BadRequestException(
        StudentError.ERR_4.replace('@1', this.generateErrorInfo(student))
      );
    }
  }

  public checkGraduated(student: Student): void {
    if (student.isGraduate === IsGraduate.TRUE) {
      throw new BadRequestException(
        StudentError.ERR_5.replace('@1', this.generateErrorInfo(student))
      );
    }
  }

  private getSearchConditions(keyword: string) {
    return (qb: SelectQueryBuilder<Lecturer>) => {
      qb.where(`s.${StudentColumn.STUDENT_ID} LIKE :studentId`, { studentId: `%${keyword}%` })
        .orWhere(`s.${StudentColumn.SCHOOL_YEAR} LIKE :schoolYear`, { schoolYear: `%${keyword}%` })
        .orWhere(`s.${StudentColumn.STUDENT_CLASS} LIKE :studentClass`, {
          studentClass: `%${keyword}%`
        })
        .orWhere(`user.${UserColumn.USERNAME} LIKE :username`, { username: `%${keyword}%` })
        .orWhere(`user.${UserColumn.FIRSTNAME} LIKE :firstname`, { firstname: `%${keyword}%` })
        .orWhere(`user.${UserColumn.LASTNAME} LIKE :lastname`, { lastname: `%${keyword}%` });
    };
  }
}
