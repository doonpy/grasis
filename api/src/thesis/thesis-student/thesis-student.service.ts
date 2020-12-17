import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Not, Repository } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

import { ResultService } from '../../result/result.service';
import { StudentColumn, StudentError } from '../../student/student.resource';
import { StudentService } from '../../student/student.service';
import { StudentSearchAttendee } from '../../student/student.type';
import { TopicService } from '../../topic/topic.service';
import { UserColumn } from '../../user/user.resource';
import { User } from '../../user/user.type';
import { ThesisLecturerColumn } from '../thesis-lecturer/thesis-lecturer.resource';
import { ThesisLecturer } from '../thesis-lecturer/thesis-lecturer.type';
import { ThesisColumn, ThesisStatus } from '../thesis.resource';
import { Thesis } from '../thesis.type';
import { ThesisStudentEntity } from './thesis-student.entity';
import { ThesisStudentColumn } from './thesis-student.resource';
import { ThesisStudent, ThesisStudentForView } from './thesis-student.type';

@Injectable()
export class ThesisStudentService {
  constructor(
    @InjectRepository(ThesisStudentEntity)
    private readonly thesisStudentRepository: Repository<ThesisStudent>,
    @Inject(forwardRef(() => StudentService))
    private readonly studentService: StudentService,
    private readonly resultService: ResultService,
    private readonly topicService: TopicService
  ) {}

  public createEntity(data: Partial<ThesisStudent>): ThesisStudent {
    return this.thesisStudentRepository.create(data);
  }

  public async getStudentParticipatedThesisByIds(ids: number[]): Promise<ThesisStudent[]> {
    if (ids.length === 0) {
      return [];
    }

    return this.thesisStudentRepository.find({
      join: { alias: 'ts', innerJoin: { thesis: 'ts.thesis' } },
      where: (qb: SelectQueryBuilder<ThesisStudent>) => {
        qb.where(`thesis.${ThesisColumn.STATUS} = :status`, {
          status: ThesisStatus.ACTIVE
        }).andWhere(`ts.${ThesisStudentColumn.STUDENT_ID} IN (:studentIds)`, {
          studentIds: In(ids).value
        });
      },
      cache: true
    });
  }

  public async getStudentParticipatedThesisByIdsWithTransaction(
    manager: EntityManager,
    thesisId: number,
    ids: number[]
  ): Promise<ThesisStudent[]> {
    if (ids.length === 0) {
      return [];
    }

    return manager.find(ThesisStudentEntity, {
      where: {
        studentId: In(ids),
        thesisId: Not(thesisId),
        thesis: { status: ThesisStatus.ACTIVE }
      },
      cache: true
    });
  }

  public async getThesisStudentsForView(
    offset: number,
    limit: number,
    thesisId: number,
    keyword?: string
  ): Promise<ThesisStudentForView[]> {
    const topicIds = (await this.topicService.getManyByThesisId(thesisId)).map(({ id }) => id);
    const students = await this.thesisStudentRepository.find({
      join: {
        alias: 'ts',
        innerJoinAndSelect: { student: 'ts.student', user: 'student.user' }
      },
      where: this.getSearchConditions(thesisId, keyword),
      skip: offset,
      take: limit,
      cache: true
    });
    const studentIds = students.map(({ studentId }) => studentId);
    const studentResults = await this.resultService.getByStudentIds(topicIds, studentIds);

    return students.map(
      ({
        student: {
          id,
          studentId,
          studentClass,
          schoolYear,
          user: { firstname, lastname, gender }
        }
      }) => {
        const results = studentResults.filter(({ studentId }) => studentId === id);
        const result = this.resultService.calculateFinishAverage(results);

        return { id, schoolYear, studentClass, studentId, firstname, lastname, gender, result };
      }
    );
  }

  public async getAmountStudentAttendee(thesisId: number, keyword?: string): Promise<number> {
    return this.thesisStudentRepository.count({
      join: {
        alias: 'ts',
        innerJoin: { student: 'ts.student', user: 'student.user' }
      },
      where: this.getSearchConditions(thesisId, keyword),
      cache: true
    });
  }

  public async hasPermission(id: number, loginUser: User): Promise<boolean> {
    return (
      (await this.thesisStudentRepository.count({
        thesisId: id,
        student: { user: { id: loginUser.id } }
      })) > 0
    );
  }

  public async getThesisStudentsForEditView(thesisId: number): Promise<StudentSearchAttendee[]> {
    const students = await this.thesisStudentRepository.find({
      relations: ['student', 'student.user'],
      where: { thesisId },
      cache: true
    });

    return students.map(
      ({
        student: {
          id,
          user: { firstname, lastname },
          studentId,
          schoolYear,
          studentClass
        }
      }) => ({
        id,
        attendeeId: studentId,
        fullName: `${lastname} ${firstname}`,
        schoolYear,
        studentClass
      })
    );
  }

  public async getThesisStudentsForEdit(thesisId: number): Promise<ThesisStudent[]> {
    return this.thesisStudentRepository.find({
      where: { thesis: { id: thesisId } },
      cache: true
    });
  }

  public async updateWithTransaction(
    manager: EntityManager,
    thesis: Thesis,
    studentIds: number[]
  ): Promise<void> {
    const students = await this.studentService.findByIdsWithTransaction(manager, studentIds);
    const participatedThesisStudentIds = (
      await this.getStudentParticipatedThesisByIdsWithTransaction(manager, thesis.id, studentIds)
    ).map(({ studentId }) => studentId);
    const thesisStudents: ThesisStudent[] = [];
    for (const studentId of studentIds) {
      const studentEntity = students.find(({ id }) => id === studentId);
      if (!studentEntity) {
        throw new BadRequestException(StudentError.ERR_3);
      }

      this.studentService.checkIsActive(studentEntity);
      this.studentService.checkGraduated(studentEntity);
      this.studentService.checkHasParticipatedThesis(studentEntity, participatedThesisStudentIds);
      thesisStudents.push(
        this.createEntity({
          thesisId: thesis.id,
          studentId: studentEntity.id
        })
      );
    }

    const currentThesisStudentIds = (
      await manager.find(ThesisStudentEntity, {
        where: { thesisId: thesis.id },
        cache: true
      })
    ).map(({ studentId }) => studentId);
    const deleteIds = currentThesisStudentIds.filter((id) => !studentIds.includes(id));

    if (deleteIds.length > 0) {
      await this.deleteByStudentIdsWithTransaction(manager, deleteIds);
    }

    await manager.save(thesisStudents);
  }

  public async deleteByThesisIdWithTransaction(
    manager: EntityManager,
    thesisId: number,
    deletedAt = new Date()
  ): Promise<void> {
    await manager.update(ThesisStudentEntity, { thesisId }, { deletedAt });
  }

  public async deleteByStudentIdsWithTransaction(
    manager: EntityManager,
    studentIds: number[],
    deletedAt = new Date()
  ): Promise<void> {
    await manager.update(ThesisStudentEntity, { studentId: In(studentIds) }, { deletedAt });
  }

  public async deleteByStudentIdWithTransaction(
    manager: EntityManager,
    studentId: number,
    deletedAt = new Date()
  ): Promise<void> {
    await manager.update(ThesisStudentEntity, { studentId }, { deletedAt });
  }

  public async isParticipatedByUserId(id: number): Promise<boolean> {
    return (
      (await this.thesisStudentRepository.count({
        studentId: id,
        thesis: { status: ThesisStatus.ACTIVE }
      })) > 0
    );
  }

  private getSearchConditions(thesisId: number, keyword = '') {
    return (qb: SelectQueryBuilder<ThesisLecturer>) => {
      qb.andWhere(`ts.${ThesisLecturerColumn.THESIS_ID} = :thesisId`, { thesisId }).andWhere(
        `(user.${UserColumn.FIRSTNAME} LIKE :firstname OR user.${UserColumn.LASTNAME} LIKE :lastname OR student.${StudentColumn.STUDENT_ID} LIKE :studentId OR student.${StudentColumn.SCHOOL_YEAR} LIKE :schoolYear OR student.${StudentColumn.STUDENT_CLASS} LIKE :studentClass)`,
        {
          firstname: `%${keyword}%`,
          lastname: `%${keyword}%`,
          studentId: `%${keyword}%`,
          schoolYear: `%${keyword}%`,
          studentClass: `%${keyword}%`
        }
      );
    };
  }
}
