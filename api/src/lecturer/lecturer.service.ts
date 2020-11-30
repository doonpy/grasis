import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';

import { ThesisLecturerService } from '../thesis/thesis-lecturer/thesis-lecturer.service';
import { ThesisService } from '../thesis/thesis.service';
import { UserColumn, UserError, UserStatus, UserType } from '../user/user.resource';
import { UserService } from '../user/user.service';
import { UserRequestBody } from '../user/user.type';
import { LecturerEntity } from './lecturer.entity';
import { LecturerColumn, LecturerError, LecturerSearchType } from './lecturer.resource';
import {
  Lecturer,
  LecturerForListView,
  LecturerRequestBody,
  LecturerSearchAttendee
} from './lecturer.type';

@Injectable()
export class LecturerService {
  constructor(
    @InjectRepository(LecturerEntity) private readonly lecturerRepository: Repository<Lecturer>,
    private readonly userService: UserService,
    private readonly thesisLecturerService: ThesisLecturerService,
    private readonly connection: Connection,
    private readonly thesisService: ThesisService
  ) {}

  public async getManyForView(
    offset: number,
    limit: number,
    keyword?: string
  ): Promise<LecturerForListView[]> {
    return (
      await this.lecturerRepository.find({
        join: { alias: 'l', innerJoinAndSelect: { user: 'l.user' } },
        where: keyword ? this.getSearchConditions(keyword) : {},
        skip: offset,
        take: limit,
        cache: true
      })
    ).map(({ id, lecturerId, user: { username, firstname, lastname, gender, status } }) => ({
      id,
      lecturerId,
      username,
      firstname,
      lastname,
      gender,
      status
    }));
  }

  public async getById(id: number): Promise<Lecturer> {
    const lecturer: Lecturer | undefined = await this.lecturerRepository.findOne(id, {
      relations: ['user']
    });

    if (!lecturer) {
      throw new BadRequestException(LecturerError.ERR_3);
    }

    return lecturer;
  }

  public async isLecturerExistByLecturerId(lecturerId: string): Promise<boolean> {
    return (await this.lecturerRepository.count({ lecturerId })) > 0;
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

    return this.connection.transaction(async (manager) => {
      userBody.userType = UserType.LECTURER;
      const user = await this.userService.createUserWithTransaction(manager, userBody);
      lecturerEntity.id = user.id;

      return manager.save(lecturerEntity);
    });
  }

  public async updateById(
    id: number,
    userBody?: UserRequestBody,
    lecturerBody?: LecturerRequestBody
  ): Promise<void> {
    if (!userBody && !lecturerBody) {
      return;
    }

    const currentLecturer = await this.getById(id);
    if (userBody) {
      if (
        userBody.status === UserStatus.INACTIVE &&
        (await this.thesisLecturerService.isLecturerParticipatedThesis(id))
      ) {
        throw new BadRequestException(LecturerError.ERR_4);
      }

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
    const lecturer = await this.getById(id);
    const deletedAt = new Date();
    if (await this.thesisLecturerService.isLecturerParticipatedThesis(id)) {
      throw new BadRequestException(LecturerError.ERR_4);
    }

    if (await this.thesisService.isCreatorActiveThesis(id)) {
      throw new BadRequestException(LecturerError.ERR_5);
    }

    await this.connection.transaction(async (manager) => {
      await this.thesisLecturerService.deleteByLecturerIdWithTransaction(manager, id, deletedAt);
      lecturer.user.deletedAt = deletedAt;
      lecturer.deletedAt = deletedAt;
      await manager.save(lecturer);
    });
  }

  public async getLecturerAmount(keyword?: string): Promise<number> {
    return this.lecturerRepository.count({
      join: { alias: 'l', innerJoin: { user: 'l.user' } },
      where: keyword ? this.getSearchConditions(keyword) : {},
      cache: true
    });
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

    const lecturers = await this.lecturerRepository.find({
      join: { alias: 'l', innerJoinAndSelect: { user: 'l.user' } },
      where: (qb: SelectQueryBuilder<Lecturer>) => {
        const conditions: string[] = [];
        const parameters: Record<string, any> = {};
        if (searchTypes.includes(LecturerSearchType.LECTURER_ID)) {
          conditions.push(`l.${LecturerColumn.LECTURER_ID} LIKE :lecturerId`);
          parameters.lecturerId = `%${keyword}%`;
        }

        if (searchTypes.includes(LecturerSearchType.FULL_NAME)) {
          conditions.push(`user.${UserColumn.FIRSTNAME} LIKE :firstname`);
          conditions.push(`user.${UserColumn.LASTNAME} LIKE :lastname`);
          parameters.firstname = `%${keyword}%`;
          parameters.lastname = `%${keyword}%`;
        }

        qb.where(`user.${UserColumn.STATUS} = :status`, { status: UserStatus.ACTIVE }).andWhere(
          conditions.join(' OR '),
          parameters
        );
      },
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
      relations: ['user'],
      cache: true
    });
  }

  public async findByIdsWithTransaction(
    manager: EntityManager,
    ids: number[]
  ): Promise<Lecturer[]> {
    return await manager.findByIds(LecturerEntity, ids, {
      relations: ['user'],
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

  private getSearchConditions(keyword: string) {
    return (qb: SelectQueryBuilder<Lecturer>) => {
      qb.where(`l.${LecturerColumn.LECTURER_ID} LIKE :lecturerId`, { lecturerId: `%${keyword}%` })
        .orWhere(`l.${LecturerColumn.POSITION} LIKE :position`, { position: `%${keyword}%` })
        .orWhere(`user.${UserColumn.USERNAME} LIKE :username`, { username: `%${keyword}%` })
        .orWhere(`user.${UserColumn.FIRSTNAME} LIKE :firstname`, { firstname: `%${keyword}%` })
        .orWhere(`user.${UserColumn.LASTNAME} LIKE :lastname`, { lastname: `%${keyword}%` });
    };
  }

  public async isExistById(id: number): Promise<boolean> {
    return (await this.lecturerRepository.count({ id })) > 0;
  }

  public async checkExistedById(id: number): Promise<void> {
    if (!(await this.isExistById(id))) {
      throw new BadRequestException(LecturerError.ERR_3);
    }
  }
}
