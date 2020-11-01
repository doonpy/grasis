import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Not, Repository } from 'typeorm';

import { NOT_DELETE_CONDITION } from '../../common/common.resource';
import { StudentSearchAttendee } from '../../student/student.interface';
import { StudentError } from '../../student/student.resource';
import { StudentService } from '../../student/student.service';
import { User } from '../../user/user.interface';
import { Thesis } from '../thesis.interface';
import { ATTENDEES_LOAD_LIMIT, ThesisStatus } from '../thesis.resource';
import { ThesisStudentEntity } from './thesis-student.entity';
import { ThesisStudent } from './thesis-student.interface';

@Injectable()
export class ThesisStudentService {
  constructor(
    @InjectRepository(ThesisStudentEntity)
    private readonly thesisStudentRepository: Repository<ThesisStudent>,
    @Inject(forwardRef(() => StudentService))
    private readonly studentService: StudentService
  ) {}

  public createEntity(data: Partial<ThesisStudent>): ThesisStudent {
    return this.thesisStudentRepository.create(data);
  }

  public async getStudentParticipatedThesisByIds(ids: number[]): Promise<ThesisStudent[]> {
    if (ids.length === 0) {
      return [];
    }

    return this.thesisStudentRepository.find({
      where: {
        studentId: In(ids),
        thesis: { status: ThesisStatus.ACTIVE },
        student: { user: { ...NOT_DELETE_CONDITION } },
        ...NOT_DELETE_CONDITION
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
        thesis: { status: ThesisStatus.ACTIVE },
        student: { user: { ...NOT_DELETE_CONDITION } },
        ...NOT_DELETE_CONDITION
      },
      cache: true
    });
  }

  public async getThesisStudentsForView(
    thesisId: number,
    offset = 0,
    limit = ATTENDEES_LOAD_LIMIT
  ): Promise<ThesisStudent[]> {
    return this.thesisStudentRepository.find({
      relations: { student: { user: {} } },
      where: { thesisId, student: { user: { ...NOT_DELETE_CONDITION } }, ...NOT_DELETE_CONDITION },
      skip: offset,
      take: limit,
      cache: true
    });
  }

  public async isLoadMoreStudentsOfThesis(thesisId: number, offset = 0): Promise<boolean> {
    const amount = await this.thesisStudentRepository.count({
      thesisId,
      student: { user: { ...NOT_DELETE_CONDITION } },
      ...NOT_DELETE_CONDITION
    });

    return amount - offset - ATTENDEES_LOAD_LIMIT > 0;
  }

  public async hasPermission(id: number, loginUser: User): Promise<boolean> {
    return (
      (await this.thesisStudentRepository.count({
        thesisId: id,
        student: { user: { ...NOT_DELETE_CONDITION, id: loginUser.id } },
        ...NOT_DELETE_CONDITION
      })) > 0
    );
  }

  public async getThesisStudentsForEditView(thesisId: number): Promise<StudentSearchAttendee[]> {
    const students = await this.thesisStudentRepository.find({
      relations: { student: { user: {} } },
      where: { thesisId, student: { user: { ...NOT_DELETE_CONDITION } }, ...NOT_DELETE_CONDITION },
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
      where: { thesis: { id: thesisId }, ...NOT_DELETE_CONDITION },
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
          studentId: studentEntity.id,
          deletedAt: null
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
        ...NOT_DELETE_CONDITION,
        studentId: id,
        thesis: { status: ThesisStatus.ACTIVE }
      })) > 0
    );
  }
}
