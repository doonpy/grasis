import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, EntityManager, Repository } from 'typeorm';

import { User } from '../user/user.interface';
import { UserType } from '../user/user.resource';
import { UserService } from '../user/user.service';
import { StudentEntity } from './student.entity';
import {
  SplitUserFromRequestBody,
  Student,
  StudentRequestBody,
  StudentView
} from './student.interface';
import { STD_ERROR_RESOURCE } from './student.resource';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentEntity) private studentRepository: Repository<Student>,
    private userService: UserService,
    private connection: Connection
  ) {}

  public async findAll(offset: number, limit: number): Promise<StudentView[]> {
    const students = await this.studentRepository.find({
      relations: ['id'],
      skip: offset,
      take: limit,
      cache: true
    });

    return students.map((student) => this.convertToView({ student }));
  }

  public async findById(id: number): Promise<StudentView> {
    const student: Student | undefined = await this.studentRepository.findOne(id, {
      relations: ['id'],
      cache: true
    });

    if (!student) {
      throw new BadRequestException(STD_ERROR_RESOURCE.ERR_3);
    }

    return this.convertToView({ student });
  }

  public async findByIdTransaction(manager: EntityManager, id: number): Promise<Student> {
    const student: Student | undefined = await manager.findOne<Student>(StudentEntity, id, {
      cache: true
    });

    if (!student) {
      throw new BadRequestException(STD_ERROR_RESOURCE.ERR_3);
    }

    return this.convertToView({ student });
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

  public async create(data: StudentRequestBody): Promise<StudentView> {
    return await this.connection.transaction(async (manager) => {
      data.userType = UserType.STUDENT;
      const user: User = await this.userService.createTransaction(manager, data);

      if (data.studentId) {
        await this.checkStudentNotExistByStudentIdTransaction(manager, data.studentId);
      }

      const createObject: Student = await manager.create<Student>(StudentEntity, {
        ...this.filterNullProperties(data),
        id: user.id
      });
      const student = await manager.save<Student>(createObject);

      return this.convertToView({ student, user });
    });
  }

  public async updateById(id: number, data: StudentRequestBody): Promise<void> {
    await this.connection.transaction(async (manager) => {
      await this.userService.checkUserExistByIdTransaction(manager, id);
      const currentStudent = await this.findByIdTransaction(manager, id);
      data.userType = UserType.STUDENT;
      const { user, remain: student } = this.userService.splitUserFromRequestBody(
        data
      ) as SplitUserFromRequestBody;
      await this.userService.updateByIdTransaction(manager, id, user);

      if (student.studentId && data.studentId !== currentStudent.studentId) {
        await this.checkStudentNotExistByStudentIdTransaction(manager, student.studentId);
      }

      await manager.update<Student>(StudentEntity, id, this.filterNullProperties(student));
    });
  }

  public async deleteById(id: number): Promise<void> {
    await this.connection.transaction(async (manager) => {
      await this.userService.checkUserExistByIdTransaction(manager, id);
      await manager.softDelete<StudentEntity>(StudentEntity, id);
      await this.userService.deleteByIdTransaction(manager, id);
    });
  }

  public async getStudentAmount(): Promise<number> {
    return this.studentRepository.count();
  }

  public convertToView({ student }: { student: Student }): StudentView;
  public convertToView({ student, user }: { student: Student; user?: User }): StudentView;
  public convertToView({ student, user }: any): any {
    const {
      studentId,
      schoolYear,
      studentClass,
      isGraduate,
      createdAt,
      updatedAt
    } = student as Student;
    if (user) {
      return {
        ...this.userService.convertToView(user),
        studentId,
        schoolYear,
        studentClass,
        isGraduate,
        createdAt,
        updatedAt
      };
    } else {
      return {
        ...this.userService.convertToView(student.id as User),
        studentId,
        schoolYear,
        studentClass,
        isGraduate,
        createdAt,
        updatedAt
      };
    }
  }

  public filterNullProperties(student: StudentRequestBody): StudentRequestBody {
    const result: StudentRequestBody = {};
    if (typeof student.studentId !== 'undefined' && student.studentId !== null) {
      result.studentId = student.studentId;
    }
    if (typeof student.schoolYear !== 'undefined' && student.schoolYear !== null) {
      result.schoolYear = student.schoolYear;
    }
    if (typeof student.studentClass !== 'undefined' && student.studentClass !== null) {
      result.studentClass = student.studentClass;
    }
    if (typeof student.isGraduate !== 'undefined' && student.isGraduate !== null) {
      result.isGraduate = student.isGraduate;
    }

    return result;
  }
}
