import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOptionsWhere, Like, Repository } from 'typeorm';

import { NOT_DELETE_CONDITION } from '../common/common.resource';
import { UserRequestBody } from '../user/user.interface';
import { UserError, UserStatus, UserType } from '../user/user.resource';
import { UserService } from '../user/user.service';
import { LecturerEntity } from './lecturer.entity';
import { Lecturer, LecturerRequestBody, LecturerSearchAttendee } from './lecturer.interface';
import { LecturerError, LecturerRelation, LecturerSearchType } from './lecturer.resource';

@Injectable()
export class LecturerService {
  constructor(
    @InjectRepository(LecturerEntity) private lecturerRepository: Repository<Lecturer>,
    private userService: UserService
  ) {}

  public async findMany(offset: number, limit: number): Promise<Lecturer[]> {
    return await this.lecturerRepository.find({
      relations: [LecturerRelation.USER],
      where: { ...NOT_DELETE_CONDITION },
      skip: offset,
      take: limit,
      cache: true
    });
  }

  public async findById(id: number): Promise<Lecturer> {
    const lecturer: Lecturer | undefined = await this.lecturerRepository.findOne(id, {
      relations: [LecturerRelation.USER],
      where: { ...NOT_DELETE_CONDITION },
      cache: true
    });

    if (!lecturer) {
      throw new BadRequestException(LecturerError.ERR_3);
    }

    return lecturer;
  }

  public async isLecturerExistByLecturerId(lecturerId: string): Promise<boolean> {
    return (await this.lecturerRepository.count({ lecturerId, ...NOT_DELETE_CONDITION })) > 0;
  }

  public async isLecturerExistById(id: number): Promise<boolean> {
    return (await this.lecturerRepository.count({ id, ...NOT_DELETE_CONDITION })) > 0;
  }

  public async checkLecturerNotExistByLecturerId(lecturerId: string): Promise<void> {
    if (await this.isLecturerExistByLecturerId(lecturerId)) {
      throw new BadRequestException(LecturerError.ERR_2);
    }
  }

  public async create(
    userBody: UserRequestBody,
    lecturerBody?: LecturerRequestBody
  ): Promise<Lecturer> {
    const userEntity = await this.userService.createUser(userBody);
    userEntity.userType = UserType.LECTURER;

    let lecturerEntity: Lecturer;
    if (lecturerBody) {
      if (lecturerBody.lecturerId) {
        await this.checkLecturerNotExistByLecturerId(lecturerBody.lecturerId);
      }

      if (lecturerBody.level) {
        lecturerBody.level = this.sanitizeLevel(lecturerBody.level);
      }

      lecturerEntity = this.lecturerRepository.create(lecturerBody);
    } else {
      lecturerEntity = this.lecturerRepository.create({});
    }

    lecturerEntity.user = userEntity;
    return this.lecturerRepository.save(lecturerEntity);
  }

  public async updateById(
    id: number,
    userBody?: UserRequestBody,
    lecturerBody?: LecturerRequestBody
  ): Promise<void> {
    if (!userBody && !lecturerBody) {
      return;
    }

    const currentLecturer = await this.findById(id);
    if (userBody) {
      currentLecturer.user = await this.userService.updateById(currentLecturer.user, userBody);
    }

    if (lecturerBody) {
      const { lecturerId, level, position } = lecturerBody;
      if (lecturerId && lecturerId !== currentLecturer.lecturerId) {
        await this.checkLecturerNotExistByLecturerId(lecturerId);
        currentLecturer.lecturerId = lecturerId;
      }

      if (level) {
        currentLecturer.level = this.sanitizeLevel(level);
      }

      if (position) {
        currentLecturer.position = position;
      }
    }

    await this.lecturerRepository.save(currentLecturer);
  }

  public async deleteById(id: number): Promise<void> {
    const lecturer = await this.findById(id);
    const currentData = new Date();
    lecturer.user.deletedAt = currentData;
    lecturer.deletedAt = currentData;
    await this.lecturerRepository.save(lecturer);
  }

  public async getLecturerAmount(): Promise<number> {
    return this.lecturerRepository.count({ ...NOT_DELETE_CONDITION });
  }

  public sanitizeLevel(level: string): string {
    let result = level.trim();
    if (result.endsWith(';')) {
      result = result.slice(0, result.length - 1);
    }

    if (result.startsWith(';')) {
      result = result.slice(1, result.length - 1);
    }

    return result;
  }

  public async searchThesisAttendees(
    keyword?: string,
    searchTypes?: LecturerSearchType[]
  ): Promise<LecturerSearchAttendee[]> {
    if (!keyword || !searchTypes || searchTypes.length === 0) {
      return [];
    }

    const conditions: FindOptionsWhere<Lecturer> = [];
    if (searchTypes.includes(LecturerSearchType.LECTURER_ID)) {
      conditions.push({
        ...NOT_DELETE_CONDITION,
        lecturerId: Like(`%${keyword}%`),
        user: { status: UserStatus.ACTIVE }
      });
    }

    if (searchTypes.includes(LecturerSearchType.FULL_NAME)) {
      conditions.push({
        user: {
          ...NOT_DELETE_CONDITION,
          firstname: Like(`%${keyword}%`),
          status: UserStatus.ACTIVE
        }
      });
      conditions.push({
        user: {
          ...NOT_DELETE_CONDITION,
          lastname: Like(`%${keyword}%`),
          status: UserStatus.ACTIVE
        }
      });
    }

    const lecturers = await this.lecturerRepository.find({
      relations: [LecturerRelation.USER],
      where: conditions,
      cache: true
    });

    return lecturers.map(({ id, lecturerId, user: { firstname, lastname } }) => ({
      id,
      attendeeId: lecturerId,
      fullName: `${lastname} ${firstname}`
    }));
  }

  public async findByIds(ids: number[]): Promise<Lecturer[]> {
    return await this.lecturerRepository.findByIds(ids, {
      relations: [LecturerRelation.USER],
      where: { ...NOT_DELETE_CONDITION },
      cache: true
    });
  }

  public async findByIdsWithTransaction(
    manager: EntityManager,
    ids: number[]
  ): Promise<Lecturer[]> {
    return await manager.findByIds(LecturerEntity, ids, {
      relations: { user: {} },
      where: { ...NOT_DELETE_CONDITION },
      cache: true
    });
  }

  public generateErrorInfo({ user, lecturerId }: Lecturer): string {
    const { firstname, lastname } = user;

    return `${lastname} ${firstname} (${lecturerId})`;
  }

  public checkIsActive(lecturer: Lecturer): void {
    const userStatus = lecturer.user.status;
    if (userStatus === UserStatus.INACTIVE) {
      throw new BadRequestException(
        UserError.ERR_9.replace('%s', this.generateErrorInfo(lecturer))
      );
    }
  }
}
