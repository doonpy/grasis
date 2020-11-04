import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOptionsWhere, In, Like, Repository } from 'typeorm';

import { notDeleteCondition } from '../../common/common.resource';
import { LecturerSearchAttendee } from '../../lecturer/lecturer.interface';
import { LecturerError } from '../../lecturer/lecturer.resource';
import { LecturerService } from '../../lecturer/lecturer.service';
import { User } from '../../user/user.interface';
import { Thesis } from '../thesis.interface';
import { ThesisStatus } from '../thesis.resource';
import { ThesisLecturerEntity } from './thesis-lecturer.entity';
import { ThesisLecturer, ThesisLecturerForView } from './thesis-lecturer.interface';

@Injectable()
export class ThesisLecturerService {
  constructor(
    @InjectRepository(ThesisLecturerEntity)
    private readonly thesisLecturerRepository: Repository<ThesisLecturer>,
    @Inject(forwardRef(() => LecturerService))
    private readonly lecturerService: LecturerService
  ) {}

  public createEntity(data: Partial<ThesisLecturer>): ThesisLecturer {
    return this.thesisLecturerRepository.create(data);
  }

  public async getThesisLecturersForView(
    offset: number,
    limit: number,
    thesisId: number,
    keyword?: string
  ): Promise<ThesisLecturerForView[]> {
    let conditions: FindOptionsWhere<ThesisLecturer> | undefined = {
      ...notDeleteCondition,
      thesisId,
      lecturer: { user: { ...notDeleteCondition } }
    };
    if (keyword) {
      conditions = this.getSearchConditions(thesisId, keyword);
    }

    return (
      await this.thesisLecturerRepository.find({
        relations: { lecturer: { user: {} } },
        where: conditions,
        skip: offset,
        take: limit,
        cache: true
      })
    ).map(({ lecturer: { id, lecturerId, user: { firstname, lastname, gender } } }) => ({
      id,
      lecturerId,
      firstname,
      lastname,
      gender
    }));
  }

  public async getThesisLecturersForEdit(thesisId: number): Promise<LecturerSearchAttendee[]> {
    const lecturers = await this.thesisLecturerRepository.find({
      relations: { lecturer: { user: {} } },
      where: { thesisId, lecturer: { user: { ...notDeleteCondition } }, ...notDeleteCondition },
      cache: true
    });

    return lecturers.map(({ lecturer: { id, lecturerId, user: { firstname, lastname } } }) => ({
      id,
      attendeeId: lecturerId,
      fullName: `${lastname} ${firstname}`
    }));
  }

  public async getAmountLecturerAttendee(thesisId: number, keyword?: string): Promise<number> {
    let conditions: FindOptionsWhere<ThesisLecturer> | undefined = {
      ...notDeleteCondition,
      thesisId,
      lecturer: { user: { ...notDeleteCondition } }
    };
    if (keyword) {
      conditions = this.getSearchConditions(thesisId, keyword);
    }

    return this.thesisLecturerRepository.count(conditions);
  }

  public async updateWithTransaction(
    manager: EntityManager,
    thesis: Thesis,
    lecturerIds: number[]
  ): Promise<void> {
    const lecturers = await this.lecturerService.findByIdsWithTransaction(manager, lecturerIds);
    const thesisLecturers: ThesisLecturer[] = [];
    for (const lecturerId of lecturerIds) {
      const lecturerEntity = lecturers.find(({ id }) => id === lecturerId);
      if (!lecturerEntity) {
        throw new BadRequestException(LecturerError.ERR_3);
      }

      await this.lecturerService.checkIsActive(lecturerEntity);
      thesisLecturers.push(
        this.createEntity({
          thesisId: thesis.id,
          lecturerId: lecturerEntity.id,
          deletedAt: null
        })
      );
    }

    const currentThesisLecturerIds = (
      await manager.find(ThesisLecturerEntity, {
        where: { thesisId: thesis.id },
        cache: true
      })
    ).map(({ lecturerId }) => lecturerId);
    const deleteIds = currentThesisLecturerIds.filter((id) => !lecturerIds.includes(id));

    if (deleteIds.length > 0) {
      await this.deleteByLecturerIdsWithTransaction(manager, deleteIds);
    }

    await manager.save(thesisLecturers);
  }

  public async deleteByThesisIdWithTransaction(
    manager: EntityManager,
    thesisId: number,
    deletedAt = new Date()
  ): Promise<void> {
    await manager.update(ThesisLecturerEntity, { thesisId }, { deletedAt });
  }

  public async deleteByLecturerIdsWithTransaction(
    manager: EntityManager,
    lecturerIds: number[],
    deletedAt = new Date()
  ): Promise<void> {
    await manager.update(ThesisLecturerEntity, { lecturerId: In(lecturerIds) }, { deletedAt });
  }

  public async deleteByLecturerIdWithTransaction(
    manager: EntityManager,
    lecturerId: number,
    deletedAt = new Date()
  ): Promise<void> {
    await manager.update(ThesisLecturerEntity, { lecturerId }, { deletedAt });
  }

  public async isLecturerParticipatedThesis(userId: number): Promise<boolean> {
    return (
      (await this.thesisLecturerRepository.count({
        ...notDeleteCondition,
        lecturerId: userId,
        thesis: { status: ThesisStatus.ACTIVE }
      })) > 0
    );
  }

  public async hasPermission(id: number, loginUser: User): Promise<boolean> {
    return (
      (await this.thesisLecturerRepository.count({
        thesisId: id,
        lecturer: { user: { ...notDeleteCondition, id: loginUser.id } },
        ...notDeleteCondition
      })) > 0
    );
  }

  private getSearchConditions(thesisId: number, keyword: string): FindOptionsWhere<ThesisLecturer> {
    const commonConditions = { ...notDeleteCondition, thesisId };

    return [
      { ...commonConditions, lecturer: { lecturerId: Like(`%${keyword}%`) } },
      {
        ...commonConditions,
        lecturer: {
          user: {
            ...notDeleteCondition,
            firstname: Like(`%${keyword}%`)
          }
        }
      },
      {
        ...commonConditions,
        lecturer: {
          user: {
            ...notDeleteCondition,
            lastname: Like(`%${keyword}%`)
          }
        }
      }
    ];
  }
}
