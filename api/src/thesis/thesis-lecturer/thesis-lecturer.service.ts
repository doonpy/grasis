import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

import { LecturerColumn, LecturerError } from '../../lecturer/lecturer.resource';
import { LecturerService } from '../../lecturer/lecturer.service';
import { LecturerForFastView, LecturerSearchAttendee } from '../../lecturer/lecturer.type';
import { UserColumn } from '../../user/user.resource';
import { User } from '../../user/user.type';
import { ThesisStatus } from '../thesis.resource';
import { Thesis } from '../thesis.type';
import { ThesisLecturerEntity } from './thesis-lecturer.entity';
import { ThesisLecturerColumn } from './thesis-lecturer.resource';
import { ThesisLecturer, ThesisLecturerForView } from './thesis-lecturer.type';

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
    return (
      await this.thesisLecturerRepository.find({
        join: {
          alias: 'tl',
          innerJoinAndSelect: { lecturer: 'tl.lecturer', user: 'lecturer.user' }
        },
        where: this.getSearchConditions(thesisId, keyword),
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
      relations: ['lecturer', 'lecturer.user'],
      where: { thesisId },
      cache: true
    });

    return lecturers.map(({ lecturer: { id, lecturerId, user: { firstname, lastname } } }) => ({
      id,
      attendeeId: lecturerId,
      fullName: `${lastname} ${firstname}`
    }));
  }

  public async getAmountLecturerAttendee(thesisId: number, keyword?: string): Promise<number> {
    return this.thesisLecturerRepository.count({
      join: {
        alias: 'tl',
        innerJoin: { lecturer: 'tl.lecturer', user: 'lecturer.user' }
      },
      where: this.getSearchConditions(thesisId, keyword),
      cache: true
    });
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
          lecturerId: lecturerEntity.id
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
        lecturerId: userId,
        thesis: { status: ThesisStatus.ACTIVE }
      })) > 0
    );
  }

  public async hasPermission(id: number, user: User): Promise<boolean> {
    return (
      (await this.thesisLecturerRepository.count({
        thesisId: id,
        lecturer: { user: { id: user.id } }
      })) > 0
    );
  }

  private getSearchConditions(thesisId: number, keyword = '') {
    return (qb: SelectQueryBuilder<ThesisLecturer>) => {
      qb.andWhere(`tl.${ThesisLecturerColumn.THESIS_ID} = :thesisId`, { thesisId }).andWhere(
        `(user.${UserColumn.FIRSTNAME} LIKE :firstname OR user.${UserColumn.LASTNAME} LIKE :lastname OR lecturer.${LecturerColumn.LECTURER_ID} LIKE :lecturerId)`,
        {
          firstname: `%${keyword}%`,
          lastname: `%${keyword}%`,
          lecturerId: `%${keyword}%`
        }
      );
    };
  }

  public async searchByFullNameInThesis(
    keyword: string,
    thesisId: number
  ): Promise<LecturerForFastView[]> {
    if (!keyword) {
      return [];
    }

    const thesisLecturers = await this.thesisLecturerRepository.find({
      join: {
        alias: 'tl',
        innerJoinAndSelect: { lecturer: 'tl.lecturer', user: 'lecturer.user' }
      },
      where: this.getSearchConditions(thesisId, keyword),
      cache: true
    });

    return thesisLecturers.map(({ lecturer }) => lecturer.convertToFastView());
  }

  public async getByThesisId(thesisId: number): Promise<ThesisLecturer[]> {
    return this.thesisLecturerRepository.find({
      where: { thesisId },
      cache: true
    });
  }
}
