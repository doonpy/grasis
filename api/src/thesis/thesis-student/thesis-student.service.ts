import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { ThesisStatus } from '../thesis.resource';
import { ThesisStudentEntity } from './thesis-student.entity';
import { ThesisStudent } from './thesis-student.interface';

@Injectable()
export class ThesisStudentService {
  constructor(
    @InjectRepository(ThesisStudentEntity)
    private readonly thesisStudentRepository: Repository<ThesisStudent>
  ) {}

  public createEntity(data: Partial<ThesisStudent>): ThesisStudent {
    return this.thesisStudentRepository.create(data);
  }

  public async getStudentParticipatedThesisByIds(ids: number[]): Promise<ThesisStudent[]> {
    if (ids.length === 0) {
      return [];
    }

    return this.thesisStudentRepository.find({
      where: { studentId: In(ids), thesis: { status: ThesisStatus.ACTIVE } },
      cache: true
    });
  }
}
