import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Student } from './student.model';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import { Sequelize } from 'sequelize-typescript';
import { STD_ERROR_RESOURCE, STD_MODEL_RESOURCE } from './student.resource';
import {
  COMMON_MODEL_RESOURCE,
  COMMON_QUERIES_VALUE,
} from '../common/common.resource';
import { USER_MODEL_RESOURCE } from '../user/user.resource';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student) private studentModel: typeof Student,
    private userService: UserService,
    private sequelize: Sequelize,
  ) {}

  public async findAll(
    offset: number = COMMON_QUERIES_VALUE.OFFSET,
    limit: number = COMMON_QUERIES_VALUE.LIMIT,
  ): Promise<Student[]> {
    return this.studentModel.findAll({
      attributes: [
        STD_MODEL_RESOURCE.FIELD_NAME.USER_ID,
        STD_MODEL_RESOURCE.FIELD_NAME.STUDENT_ID,
        STD_MODEL_RESOURCE.FIELD_NAME.SCHOOL_YEAR,
        COMMON_MODEL_RESOURCE.FIELD_NAME.CREATE_AT,
        COMMON_MODEL_RESOURCE.FIELD_NAME.UPDATE_AT,
      ],
      include: {
        all: true,
        attributes: [
          USER_MODEL_RESOURCE.FIELD_NAME.USERNAME,
          USER_MODEL_RESOURCE.FIELD_NAME.FIRSTNAME,
          USER_MODEL_RESOURCE.FIELD_NAME.LASTNAME,
          USER_MODEL_RESOURCE.FIELD_NAME.GENDER,
          USER_MODEL_RESOURCE.FIELD_NAME.EMAIL,
          USER_MODEL_RESOURCE.FIELD_NAME.ADDRESS,
          USER_MODEL_RESOURCE.FIELD_NAME.PHONE,
          USER_MODEL_RESOURCE.FIELD_NAME.STATUS,
        ],
      },
      offset,
      limit,
    });
  }

  public async findByUserId(userId: number): Promise<Student> {
    const student: Student | null = await this.studentModel.findByPk(userId, {
      attributes: [
        STD_MODEL_RESOURCE.FIELD_NAME.USER_ID,
        STD_MODEL_RESOURCE.FIELD_NAME.STUDENT_ID,
        STD_MODEL_RESOURCE.FIELD_NAME.SCHOOL_YEAR,
        COMMON_MODEL_RESOURCE.FIELD_NAME.CREATE_AT,
        COMMON_MODEL_RESOURCE.FIELD_NAME.UPDATE_AT,
      ],
      include: {
        all: true,
        attributes: [
          USER_MODEL_RESOURCE.FIELD_NAME.USERNAME,
          USER_MODEL_RESOURCE.FIELD_NAME.FIRSTNAME,
          USER_MODEL_RESOURCE.FIELD_NAME.LASTNAME,
          USER_MODEL_RESOURCE.FIELD_NAME.GENDER,
          USER_MODEL_RESOURCE.FIELD_NAME.EMAIL,
          USER_MODEL_RESOURCE.FIELD_NAME.ADDRESS,
          USER_MODEL_RESOURCE.FIELD_NAME.PHONE,
          USER_MODEL_RESOURCE.FIELD_NAME.STATUS,
        ],
      },
    });

    if (!student) {
      throw new BadRequestException(STD_ERROR_RESOURCE.ERR_3);
    }

    return student;
  }

  public async isStudentIdExist(studentId: string): Promise<boolean> {
    return (await this.studentModel.count({ where: { studentId } })) > 0;
  }

  public async isUserIdExist(userId: number): Promise<boolean> {
    return (await this.studentModel.count({ where: { userId } })) > 0;
  }

  public async create(user: User, student: Student): Promise<void> {
    try {
      return this.sequelize.transaction(async () => {
        const createdUser: User = await this.userService.create(user);
        student.userId = createdUser.id;

        if (await this.isStudentIdExist(student.studentId)) {
          throw new BadRequestException(STD_ERROR_RESOURCE.ERR_1);
        }

        if (await this.isUserIdExist(student.userId)) {
          throw new BadRequestException(STD_ERROR_RESOURCE.ERR_2);
        }

        await this.studentModel.create(student);
      });
    } catch ({ message }) {
      throw new InternalServerErrorException(message);
    }
  }

  public async updateById(
    id: number,
    user: Partial<User> | undefined,
    student: Partial<Student> | undefined,
  ): Promise<void> {
    try {
      return this.sequelize.transaction(async () => {
        if (user) {
          await this.userService.updateById(id, user);
        }
        const currentStudent: Student = await this.findByUserId(id);

        if (student) {
          if (
            student.studentId &&
            (await this.isStudentIdExist(student.studentId))
          ) {
            throw new BadRequestException(STD_ERROR_RESOURCE.ERR_1);
          }

          await currentStudent.update(student);
        }
      });
    } catch ({ message }) {
      throw new InternalServerErrorException(message);
    }
  }

  public async deleteById(id: number): Promise<void> {
    try {
      await this.sequelize.transaction(async () => {
        const currentValue: Student = await this.findByUserId(id);
        await currentValue.destroy();
        await this.userService.deleteById(id);
      });
    } catch ({ message }) {
      throw new InternalServerErrorException(message);
    }
  }

  public async getStudentAmount(): Promise<number> {
    return this.studentModel.count();
  }
}
