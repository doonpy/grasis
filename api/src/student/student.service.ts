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
import { COMMON_SELECT_ATTRIBUTES } from '../common/common.resource';
import { USER_MODEL_RESOURCE } from '../user/user.resource';

const findAttributes = [
  ...COMMON_SELECT_ATTRIBUTES,
  STD_MODEL_RESOURCE.FIELD_NAME.STUDENT_ID,
  STD_MODEL_RESOURCE.FIELD_NAME.SCHOOL_YEAR,
];

const includeAttributes = [
  {
    model: User,
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
];

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student) private studentModel: typeof Student,
    private userService: UserService,
    private sequelize: Sequelize,
  ) {}

  public async findAll(offset: number, limit: number): Promise<Student[]> {
    return this.studentModel.findAll({
      offset,
      limit,
      attributes: findAttributes,
      include: includeAttributes,
    });
  }

  public async findById(id: number): Promise<Student> {
    const student: Student | null = await this.studentModel.findByPk(id, {
      attributes: findAttributes,
      include: includeAttributes,
    });

    if (!student) {
      throw new BadRequestException(STD_ERROR_RESOURCE.ERR_3);
    }

    return student;
  }

  public async isStudentIdExist(studentId: string): Promise<boolean> {
    return (await this.studentModel.count({ where: { studentId } })) > 0;
  }

  public async isStudentExits(id: number): Promise<boolean> {
    return (await this.studentModel.count({ where: { id } })) > 0;
  }

  public async create(user: User, student: Student): Promise<void> {
    try {
      return this.sequelize.transaction(async () => {
        const createdUser: User = await this.userService.create(user);
        student.id = createdUser.id;

        if (await this.isStudentIdExist(student.studentId)) {
          throw new BadRequestException(STD_ERROR_RESOURCE.ERR_1);
        }

        if (await this.isStudentExits(student.id)) {
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
        const currentStudent: Student = await this.findById(id);

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
        const student: Student = await this.findById(id);
        await student.destroy();
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
