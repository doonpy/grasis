import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { NOT_DELETE_CONDITION } from '../../common/common.resource';
import { User } from '../../user/user.interface';
import { ATTENDEES_LOAD_LIMIT, ThesisStatus } from '../thesis.resource';
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
      where: {
        studentId: In(ids),
        thesis: { status: ThesisStatus.ACTIVE },
        student: { user: { ...NOT_DELETE_CONDITION } }
      },
      cache: true
    });
  }

  public async getStudentsOfThesis(
    thesisId: number,
    offset = 0,
    limit = ATTENDEES_LOAD_LIMIT
  ): Promise<ThesisStudent[]> {
    return this.thesisStudentRepository.find({
      relations: { student: { user: {} } },
      where: { thesisId, student: { user: { ...NOT_DELETE_CONDITION } } },
      skip: offset,
      take: limit,
      cache: true
    });
  }

  public async isLoadMoreStudentsOfThesis(thesisId: number, offset = 0): Promise<boolean> {
    const amount = await this.thesisStudentRepository.count({
      thesisId,
      student: { user: { ...NOT_DELETE_CONDITION } }
    });

    return amount - offset - ATTENDEES_LOAD_LIMIT > 0;
  }

  public async isThesisExistById(id: number, loginUser: User): Promise<boolean> {
    return (
      (await this.thesisStudentRepository.count({
        thesisId: id,
        student: { user: { ...NOT_DELETE_CONDITION, id: loginUser.id } }
      })) > 0
    );
  }
}
