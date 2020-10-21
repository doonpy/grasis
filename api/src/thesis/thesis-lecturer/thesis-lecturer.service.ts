import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { Lecturer } from '../../lecturer/lecturer.interface';
import { LecturerService } from '../../lecturer/lecturer.service';
import { ThesisLecturerEntity } from './thesis-lecturer.entity';
import { ThesisLecturer, ThesisLecturerView } from './thesis-lecturer.interface';

@Injectable()
export class ThesisLecturerService {
  constructor(
    @InjectRepository(ThesisLecturerEntity)
    private readonly thesisLecturerRepository: Repository<ThesisLecturer>,
    private readonly lecturerService: LecturerService
  ) {}

  public async createWithTransaction(
    manager: EntityManager,
    thesisId: number,
    lecturerIds: number[]
  ): Promise<void> {
    if (!Array.isArray(lecturerIds)) {
      return;
    }

    lecturerIds = lecturerIds.filter(
      (lecturerId, index) => index === lecturerIds.lastIndexOf(lecturerId)
    );
    for (const lecturerId of lecturerIds) {
      await this.lecturerService.checkLecturerExistByIdTransaction(manager, lecturerId);
      const thesisLecturerEntity = manager.create<ThesisLecturer>(ThesisLecturerEntity, {
        thesis: thesisId,
        lecturer: lecturerId
      });
      await manager.save<ThesisLecturer>(thesisLecturerEntity);
    }
  }

  public async findByThesisId(thesisId: number): Promise<ThesisLecturerView> {
    const thesisLecturers = await this.thesisLecturerRepository.find({
      where: { thesis: thesisId },
      cache: true
    });
    const lecturerIds = thesisLecturers.map((thesisLecturer) => thesisLecturer.lecturer as number);
    const lecturers = await this.lecturerService.getByIds(lecturerIds);

    return this.convertToView(lecturers);
  }

  public convertToView(lecturers: Lecturer[]): ThesisLecturerView {
    return lecturers.map((lecturer) => {
      const { id, firstname, lastname, status } = this.lecturerService.convertToView({ lecturer });
      return {
        id,
        firstname,
        lastname,
        status
      };
    });
  }
}
