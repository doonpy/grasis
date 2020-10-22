import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Not, Repository } from 'typeorm';

import { COMMON_FIND_CONDITION } from '../common/common.resource';
import { ThesisStudentService } from '../thesis/thesis-student/thesis-student.service';
import { UserRequestBody } from '../user/user.interface';
import { UserError, UserStatus, UserType } from '../user/user.resource';
import { UserService } from '../user/user.service';
import { StudentEntity } from './student.entity';
import { Student, StudentRequestBody, StudentSearchAttendee } from './student.interface';
import { StudentError, StudentRelation, StudentSearchType } from './student.resource';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentEntity) private studentRepository: Repository<Student>,
    private readonly userService: UserService,
    private readonly thesisStudentService: ThesisStudentService
  ) {}

  public async findMany(offset: number, limit: number): Promise<Student[]> {
    return await this.studentRepository.find({
      relations: [StudentRelation.USER],
      where: { ...COMMON_FIND_CONDITION },
      skip: offset,
      take: limit,
      cache: true
    });
  }

  public async findById(id: number): Promise<Student> {
    const student: Student | undefined = await this.studentRepository.findOne(id, {
      relations: [StudentRelation.USER],
      where: { ...COMMON_FIND_CONDITION },
      cache: true
    });

    if (!student) {
      throw new BadRequestException(StudentError.ERR_3);
    }

    return student;
  }

  public async isStudentExistById(id: number): Promise<boolean> {
    return (await this.studentRepository.count({ ...COMMON_FIND_CONDITION, id })) > 0;
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
        ...COMMON_FIND_CONDITION,
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
    userEntity.userType = UserType.LECTURER;

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

    const currentStudent = await this.findById(id);
    if (userBody) {
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
    const student = await this.findById(id);
    const currentDate = new Date();
    student.user.deletedAt = currentDate;
    student.deletedAt = currentDate;
    await this.studentRepository.save(student);
  }

  public async getStudentAmount(): Promise<number> {
    return this.studentRepository.count({ ...COMMON_FIND_CONDITION });
  }

  public async searchAttendees(
    keyword?: string,
    searchTypes?: StudentSearchType[]
  ): Promise<StudentSearchAttendee[]> {
    if (!keyword || !searchTypes || searchTypes.length === 0) {
      return [];
    }

    const conditions: FindOptionsWhere<Student> = [];
    if (searchTypes && searchTypes.includes(StudentSearchType.STUDENT_ID)) {
      conditions.push({
        studentId: Like(`%${keyword}%`),
        user: { ...COMMON_FIND_CONDITION, status: UserStatus.ACTIVE }
      });
    }

    if (searchTypes && searchTypes.includes(StudentSearchType.FULL_NAME)) {
      conditions.push({
        user: {
          ...COMMON_FIND_CONDITION,
          firstname: Like(`%${keyword}%`),
          status: UserStatus.ACTIVE
        }
      });
      conditions.push({
        user: {
          ...COMMON_FIND_CONDITION,
          lastname: Like(`%${keyword}%`),
          status: UserStatus.ACTIVE
        }
      });
    }

    if (searchTypes && searchTypes.includes(StudentSearchType.STUDENT_CLASS)) {
      conditions.push({
        ...COMMON_FIND_CONDITION,
        studentClass: Like(`%${keyword}%`),
        user: { status: UserStatus.ACTIVE }
      });
    }

    if (searchTypes && searchTypes.includes(StudentSearchType.SCHOOL_YEAR)) {
      conditions.push({
        ...COMMON_FIND_CONDITION,
        schoolYear: Like(`%${keyword}%`)
      });
    }

    let students = await this.studentRepository.find({
      relations: [StudentRelation.USER],
      where: conditions,
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
      relations: [StudentRelation.USER, StudentRelation.THESES],
      where: { ...COMMON_FIND_CONDITION },
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
        StudentError.ERR_4.replace('%s', this.generateErrorInfo(student))
      );
    }
  }
}
