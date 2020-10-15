import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, EntityManager, Repository } from 'typeorm';

import { User } from '../user/user.interface';
import { UserType } from '../user/user.resource';
import { UserService } from '../user/user.service';
import { LecturerEntity } from './lecturer.entity';
import { Lecturer, LecturerRequestBody, LecturerView } from './lecturer.interface';
import { LEC_ERROR_RESOURCE } from './lecturer.resource';

@Injectable()
export class LecturerService {
  constructor(
    @InjectRepository(LecturerEntity) private lecturerRepository: Repository<Lecturer>,
    private userService: UserService,
    private connection: Connection
  ) {}

  public async findAll(offset: number, limit: number): Promise<LecturerView[]> {
    const lecturers = await this.lecturerRepository.find({
      relations: ['id'],
      skip: offset,
      take: limit,
      cache: true
    });

    return lecturers.map((lecturer) => this.convertToView({ lecturer }));
  }

  public async findById(id: number): Promise<LecturerView> {
    const lecturer: Lecturer | undefined = await this.lecturerRepository.findOne(id, {
      relations: ['id'],
      cache: true
    });

    if (!lecturer) {
      throw new BadRequestException(LEC_ERROR_RESOURCE.ERR_3);
    }

    return this.convertToView({ lecturer });
  }

  public async findByIdTransaction(manager: EntityManager, id: number): Promise<Lecturer> {
    const lecturer: Lecturer | undefined = await manager.findOne<Lecturer>(LecturerEntity, id, {
      relations: ['id'],
      cache: true
    });

    if (!lecturer) {
      throw new BadRequestException(LEC_ERROR_RESOURCE.ERR_3);
    }

    return this.convertToView({ lecturer });
  }

  public async isLecturerExistByLecturerId(lecturerId: string): Promise<boolean> {
    return (await this.lecturerRepository.count({ where: { lecturerId } })) > 0;
  }

  public async isLecturerExistById(id: number): Promise<boolean> {
    return (await this.lecturerRepository.count({ where: { id } })) > 0;
  }

  public async isLecturerExistByLecturerIdTransaction(
    manager: EntityManager,
    lecturerId: string
  ): Promise<boolean> {
    return (await manager.count<Lecturer>(LecturerEntity, { where: { lecturerId } })) > 0;
  }

  public async checkLecturerNotExistByLecturerIdTransaction(
    manager: EntityManager,
    lecturerId: string
  ): Promise<void> {
    if (await this.isLecturerExistByLecturerIdTransaction(manager, lecturerId)) {
      throw new BadRequestException(LEC_ERROR_RESOURCE.ERR_2);
    }
  }

  public async create(data: LecturerRequestBody): Promise<LecturerView> {
    return await this.connection.transaction(async (manager) => {
      data.userType = UserType.LECTURER;
      const user = await this.userService.createTransaction(manager, data);

      if (data.lecturerId) {
        await this.checkLecturerNotExistByLecturerIdTransaction(manager, data.lecturerId);
      }

      if (data.level) {
        data.level = this.sanitizeLevel(data.level);
      }

      const createObject = manager.create<Lecturer>(LecturerEntity, {
        ...this.filterNullProperties(data),
        id: user.id
      });
      const lecturer = await manager.save<Lecturer>(createObject);

      return this.convertToView({ lecturer, user });
    });
  }

  public async updateById(id: number, data: LecturerRequestBody): Promise<void> {
    await this.connection.transaction(async (manager) => {
      await this.userService.checkUserExistByIdTransaction(manager, id);
      const currentLecturer = await this.findByIdTransaction(manager, id);

      data.userType = UserType.LECTURER;
      const { user, remain: lecturer } = this.userService.splitUserFromRequestBody(data);
      await this.userService.updateByIdTransaction(manager, id, user);

      if (lecturer.lecturerId && data.lecturerId !== currentLecturer.lecturerId) {
        await this.checkLecturerNotExistByLecturerIdTransaction(manager, lecturer.lecturerId);
      }

      if (lecturer.level) {
        lecturer.level = this.sanitizeLevel(lecturer.level);
      }

      await manager.update<Lecturer>(LecturerEntity, id, this.filterNullProperties(lecturer));
    });
  }

  public async deleteById(id: number): Promise<void> {
    await this.connection.transaction(async (manager) => {
      await this.userService.checkUserExistByIdTransaction(manager, id);
      await manager.softDelete<Lecturer>(LecturerEntity, id);
      await this.userService.deleteByIdTransaction(manager, id);
    });
  }

  public async getLecturerAmount(): Promise<number> {
    return this.lecturerRepository.count();
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

  public convertToView({ lecturer }: { lecturer: Lecturer }): LecturerView;
  public convertToView({ lecturer, user }: { lecturer: Lecturer; user?: User }): LecturerView;
  public convertToView({ lecturer, user }: any): any {
    const { lecturerId, level, position, createdAt, updatedAt } = lecturer;
    if (user) {
      return {
        ...this.userService.convertToView(user),
        lecturerId,
        level,
        position,
        createdAt,
        updatedAt
      };
    } else {
      return {
        ...this.userService.convertToView(lecturer.id as User),
        lecturerId,
        level,
        position,
        createdAt,
        updatedAt
      };
    }
  }

  public filterNullProperties(lecturer: LecturerRequestBody): LecturerRequestBody {
    const result: LecturerRequestBody = {};
    if (typeof lecturer.lecturerId !== 'undefined' && lecturer.lecturerId !== null) {
      result.lecturerId = lecturer.lecturerId;
    }
    if (typeof lecturer.level !== 'undefined' && lecturer.level !== null) {
      result.level = lecturer.level;
    }
    if (typeof lecturer.position !== 'undefined' && lecturer.position !== null) {
      result.position = lecturer.position;
    }

    return result;
  }
}
