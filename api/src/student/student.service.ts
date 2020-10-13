import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, EntityManager, Repository } from 'typeorm';

import { UserEntity } from '../user/user.entity';
import { User, UserRequestBody } from '../user/user.interface';
import { UserType } from '../user/user.resource';
import { UserService } from '../user/user.service';
import { Student } from './student.entity';
import { STD_ERROR_RESOURCE } from './student.resource';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    private userService: UserService,
    private connection: Connection
  ) {}

  public async findAll(offset: number, limit: number): Promise<Student[]> {
    return this.studentRepository.find({
      skip: offset,
      take: limit,
      cache: true
    });
  }

  public async findById(id: number): Promise<Student> {
    const student: Student | undefined = await this.studentRepository.findOne(id, { cache: true });

    if (!student) {
      throw new BadRequestException(STD_ERROR_RESOURCE.ERR_3);
    }

    return student;
  }

  public async findByIdTransaction(manager: EntityManager, id: number): Promise<Student> {
    const student: Student | undefined = await manager.findOne(Student, id, { cache: true });

    if (!student) {
      throw new BadRequestException(STD_ERROR_RESOURCE.ERR_3);
    }

    return student;
  }

  public async isStudentExistById(id: number): Promise<boolean> {
    return (await this.studentRepository.count({ where: { id } })) > 0;
  }

  public async checkStudentExistById(id: number): Promise<void> {
    if (!(await this.isStudentExistById(id))) {
      throw new BadRequestException(STD_ERROR_RESOURCE.ERR_3);
    }
  }

  public async checkStudentExistByStudentIdTransaction(
    manager: EntityManager,
    studentId: string
  ): Promise<void> {
    if (!(await this.isStudentExistByStudentIdTransaction(manager, studentId))) {
      throw new BadRequestException(STD_ERROR_RESOURCE.ERR_1);
    }
  }

  public async checkStudentNotExistByStudentIdTransaction(
    manager: EntityManager,
    studentId: string
  ): Promise<void> {
    if (await this.isStudentExistByStudentIdTransaction(manager, studentId)) {
      throw new BadRequestException(STD_ERROR_RESOURCE.ERR_2);
    }
  }

  public async isStudentExistByStudentIdTransaction(
    manager: EntityManager,
    studentId: string
  ): Promise<boolean> {
    return (await this.studentRepository.count({ where: { studentId } })) > 0;
  }

  public async create(user: Partial<UserRequestBody>, student: Partial<Student>): Promise<void> {
    try {
      await this.connection.transaction(async (manager) => {
        user.userType = UserType.STUDENT;
        const createdUser: User = await this.userService.createTransaction(manager, user);
        student.id = createdUser.id;

        if (student.studentId) {
          await this.checkStudentNotExistByStudentIdTransaction(manager, student.studentId);
        }

        const createdStudent: Student = await manager.create<Student>(Student, student);
        await manager.save<Student>(createdStudent);
      });
    } catch ({ message }) {
      throw new InternalServerErrorException(message);
    }
  }

  public async updateById(
    id: number,
    user: Partial<UserRequestBody> | undefined,
    student: Partial<Student> | undefined
  ): Promise<void> {
    try {
      await this.connection.transaction(async (manager) => {
        await this.userService.checkUserExistByIdTransaction(manager, id);

        if (user) {
          user.userType = UserType.LECTURER;
          await this.userService.updateByIdTransaction(manager, id, user);
        }

        if (student) {
          if (student.studentId) {
            await this.checkStudentNotExistByStudentIdTransaction(manager, student.studentId);
          }

          const currentStudent: Student = await this.findByIdTransaction(manager, id);
          await manager.save(Student, { ...currentStudent, ...student });
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
        await manager.softDelete<Student>(Student, id);
        await this.userService.deleteByIdTransaction(manager, id);
      });
    } catch ({ message }) {
      throw new InternalServerErrorException(message);
    }
  }

  public async getStudentAmount(): Promise<number> {
    return this.studentRepository.count();
  }
}
