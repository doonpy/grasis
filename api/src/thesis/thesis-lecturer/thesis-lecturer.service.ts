import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';

import { NOT_DELETE_CONDITION } from '../../common/common.resource';
import { LecturerSearchAttendee } from '../../lecturer/lecturer.interface';
import { LecturerError } from '../../lecturer/lecturer.resource';
import { LecturerService } from '../../lecturer/lecturer.service';
import { Thesis } from '../thesis.interface';
import { ATTENDEES_LOAD_LIMIT } from '../thesis.resource';
import { ThesisLecturerEntity } from './thesis-lecturer.entity';
import { ThesisLecturer } from './thesis-lecturer.interface';

@Injectable()
export class ThesisLecturerService {
  constructor(
    @InjectRepository(ThesisLecturerEntity)
    private readonly thesisLecturerService: Repository<ThesisLecturer>,
    private readonly lecturerService: LecturerService
  ) {}

  public createEntity(data: Partial<ThesisLecturer>): ThesisLecturer {
    return this.thesisLecturerService.create(data);
  }

  public async getThesisLecturersForView(
    thesisId: number,
    offset = 0,
    limit = ATTENDEES_LOAD_LIMIT
  ): Promise<ThesisLecturer[]> {
    return this.thesisLecturerService.find({
      relations: { lecturer: { user: {} } },
      where: { thesisId, lecturer: { user: { ...NOT_DELETE_CONDITION } } },
      skip: offset,
      take: limit,
      cache: true
    });
  }

  public async getThesisLecturersForEditView(thesisId: number): Promise<LecturerSearchAttendee[]> {
    const lecturers = await this.thesisLecturerService.find({
      relations: { lecturer: { user: {} } },
      where: { thesisId, lecturer: { user: { ...NOT_DELETE_CONDITION } } },
      cache: true
    });

    return lecturers.map(({ lecturer: { id, lecturerId, user: { firstname, lastname } } }) => ({
      id,
      attendeeId: lecturerId,
      fullName: `${lastname} ${firstname}`
    }));
  }

  public async isLoadMoreLecturersOfThesis(thesisId: number, offset = 0): Promise<boolean> {
    const amount = await this.thesisLecturerService.count({
      thesisId,
      lecturer: { user: { ...NOT_DELETE_CONDITION } }
    });

    return amount - offset - ATTENDEES_LOAD_LIMIT > 0;
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
      await manager.delete(ThesisLecturerEntity, { lecturerId: In(deleteIds) });
    }

    await manager.save(thesisLecturers);
  }

  public async deleteWithTransaction(manager: EntityManager, thesisId: number): Promise<void> {
    await manager.delete(ThesisLecturerEntity, { thesisId });
  }
}
