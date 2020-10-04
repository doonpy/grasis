import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, EntityManager, Repository } from 'typeorm';

import { User } from '../user/user.entity';
import { UserType } from '../user/user.resource';
import { UserService } from '../user/user.service';
import { Lecturer } from './lecturer.entity';
import { LEC_ERROR_RESOURCE } from './lecturer.resource';

@Injectable()
export class LecturerService {
  constructor(
    @InjectRepository(Lecturer) private lecturerRepository: Repository<Lecturer>,
    private userService: UserService,
    private connection: Connection
  ) {}

  public async findAll(offset: number, limit: number): Promise<Lecturer[]> {
    return this.lecturerRepository.find({
      relations: ['id'],
      skip: offset,
      take: limit,
      cache: true
    });
  }

  public async findById(id: number): Promise<Lecturer> {
    const lecturer: Lecturer | undefined = await this.lecturerRepository.findOne(id, {
      relations: ['id'],
      cache: true
    });

    if (!lecturer) {
      throw new BadRequestException(LEC_ERROR_RESOURCE.ERR_3);
    }

    return lecturer;
  }

  public async findByIdTransaction(manager: EntityManager, id: number): Promise<Lecturer> {
    const lecturer: Lecturer | undefined = await manager.findOne(Lecturer, id, {
      relations: ['id'],
      cache: true
    });

    if (!lecturer) {
      throw new BadRequestException(LEC_ERROR_RESOURCE.ERR_3);
    }

    return lecturer;
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
    return (await manager.count<Lecturer>(Lecturer, { where: { lecturerId } })) > 0;
  }

  public async checkLecturerExistByLecturerIdTransaction(
    manager: EntityManager,
    lecturerId: string
  ): Promise<void> {
    if (!(await this.isLecturerExistByLecturerIdTransaction(manager, lecturerId))) {
      throw new BadRequestException(LEC_ERROR_RESOURCE.ERR_1);
    }
  }

  public async checkLecturerNotExistByLecturerIdTransaction(
    manager: EntityManager,
    lecturerId: string
  ): Promise<void> {
    if (await this.isLecturerExistByLecturerIdTransaction(manager, lecturerId)) {
      throw new BadRequestException(LEC_ERROR_RESOURCE.ERR_2);
    }
  }

  public async create(user: Partial<User>, lecturer: Partial<Lecturer>): Promise<void> {
    try {
      await this.connection.transaction(async (manager) => {
        user.userType = UserType.LECTURER;
        const createdUser: User = await this.userService.createTransaction(manager, user);
        if (!lecturer) {
          lecturer = {};
        }

        lecturer.id = createdUser.id;
        if (lecturer.lecturerId) {
          await this.checkLecturerNotExistByLecturerIdTransaction(manager, lecturer.lecturerId);
        }

        const createdLecturer: Lecturer = await manager.create<Lecturer>(Lecturer, lecturer);
        await manager.save<Lecturer>(createdLecturer);
      });
    } catch ({ message }) {
      throw new InternalServerErrorException(message);
    }
  }

  public async updateById(
    id: number,
    user: Partial<User> | undefined,
    lecturer: Partial<Lecturer> | undefined
  ): Promise<void> {
    try {
      await this.connection.transaction(async (manager) => {
        await this.userService.checkUserExistByIdTransaction(manager, id);

        if (user) {
          user.userType = UserType.LECTURER;
          await this.userService.updateByIdTransaction(manager, id, user);
        }

        if (lecturer) {
          if (lecturer.lecturerId) {
            await this.checkLecturerNotExistByLecturerIdTransaction(manager, lecturer.lecturerId);
          }

          const currentLecturer = await this.findByIdTransaction(manager, id);
          await manager.save(Lecturer, { ...currentLecturer, ...lecturer });
        }
      });
    } catch ({ message }) {
      throw new InternalServerErrorException(message);
    }
  }

  public async deleteById(id: number): Promise<void> {
    try {
      await this.connection.transaction(async (manager) => {
        await this.userService.checkUserExistByIdTransaction(manager, id);
        await manager.softDelete<Lecturer>(Lecturer, id);
        await this.userService.deleteByIdTransaction(manager, id);
      });
    } catch ({ message }) {
      throw new InternalServerErrorException(message);
    }
  }

  public async getLecturerAmount(): Promise<number> {
    return this.lecturerRepository.count();
  }
}
