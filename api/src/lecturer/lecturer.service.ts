import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Lecturer } from './lecturer.model';
import { InjectModel } from '@nestjs/sequelize';
import { COMMON_SELECT_ATTRIBUTES } from '../common/common.resource';
import { LecturerPosition } from '../lecturer-position/lecturer-position.model';
import { IsList, LEC_ERROR_RESOURCE, LEC_MODEL_RESOURCE } from './lecturer.resource';
import { User } from '../user/user.model';
import { STD_ERROR_RESOURCE } from '../student/student.resource';
import { UserService } from '../user/user.service';
import { IncludeOptions, Sequelize } from 'sequelize';
import { LecturerPositionService } from '../lecturer-position/lecturer-position.service';
import { USER_SELECT_ATTRIBUTES, USER_SELECT_FOR_LIST_ATTRIBUTES } from '../user/user.resource';
import {
  LPO_MODEL_RESOURCE,
  LPO_SELECT_ATTRIBUTES
} from '../lecturer-position/lecturer-position.resource';

const defaultFindAttributes = [
  ...COMMON_SELECT_ATTRIBUTES,
  LEC_MODEL_RESOURCE.FIELD_NAME.LECTURER_ID,
  LEC_MODEL_RESOURCE.FIELD_NAME.LEVEL
];

const defaultIncludeAttributes = [
  {
    model: User,
    attributes: USER_SELECT_ATTRIBUTES
  },
  {
    model: LecturerPosition,
    attributes: [...LPO_SELECT_ATTRIBUTES]
  }
];

@Injectable()
export class LecturerService {
  constructor(
    @InjectModel(Lecturer) private lecturerModel: typeof Lecturer,
    private userService: UserService,
    private lecturerPositionService: LecturerPositionService,
    private sequelize: Sequelize
  ) {}

  public async findAll(offset: number, limit: number, isList: IsList): Promise<Lecturer[]> {
    const includeAttributes: IncludeOptions[] = [
      {
        model: LecturerPosition,
        attributes: [LPO_MODEL_RESOURCE.FIELD_NAME.TITLE]
      }
    ];
    if (isList === IsList.TRUE) {
      includeAttributes.push({
        model: User,
        attributes: USER_SELECT_FOR_LIST_ATTRIBUTES
      });
    }

    return this.lecturerModel.findAll({
      offset,
      limit,
      attributes: defaultFindAttributes,
      include: includeAttributes
    });
  }

  public async findById(id: number): Promise<Lecturer> {
    const lecturer: Lecturer | null = await this.lecturerModel.findByPk(id, {
      attributes: defaultFindAttributes,
      include: defaultIncludeAttributes
    });

    if (!lecturer) {
      throw new BadRequestException(LEC_ERROR_RESOURCE.ERR_3);
    }

    return lecturer;
  }

  public async isLecturerIdExist(lecturerId: string): Promise<boolean> {
    return (await this.lecturerModel.count({ where: { lecturerId } })) > 0;
  }

  public async isLecturerExist(id: number): Promise<boolean> {
    return (await this.lecturerModel.count({ where: { id } })) > 0;
  }

  public async create(user: User, lecturer: Lecturer): Promise<void> {
    try {
      return this.sequelize.transaction(async () => {
        const createdUser: User = await this.userService.create(user);
        lecturer.id = createdUser.id;

        if (await this.isLecturerIdExist(lecturer.lecturerId)) {
          throw new BadRequestException(LEC_ERROR_RESOURCE.ERR_2);
        }

        if (await this.isLecturerExist(lecturer.id)) {
          throw new BadRequestException(STD_ERROR_RESOURCE.ERR_3);
        }

        await this.lecturerPositionService.checkLecturerPositionExistedById(lecturer.positionId);
        await this.lecturerModel.create(lecturer);
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
      return this.sequelize.transaction(async () => {
        if (user) {
          await this.userService.updateById(id, user);
        }
        const currentLecturer: Lecturer = await this.findById(id);

        if (lecturer) {
          if (lecturer.lecturerId && (await this.isLecturerIdExist(lecturer.lecturerId))) {
            throw new BadRequestException(LEC_ERROR_RESOURCE.ERR_2);
          }

          if (lecturer.positionId) {
            await this.lecturerPositionService.checkLecturerPositionExistedById(
              lecturer.positionId
            );
          }

          await currentLecturer.update(lecturer);
        }
      });
    } catch ({ message }) {
      throw new InternalServerErrorException(message);
    }
  }

  public async deleteById(id: number): Promise<void> {
    try {
      await this.sequelize.transaction(async () => {
        const lecturer: Lecturer = await this.findById(id);
        await lecturer.destroy();
        await this.userService.deleteById(id);
      });
    } catch ({ message }) {
      throw new InternalServerErrorException(message);
    }
  }

  public async getLecturerAmount(): Promise<number> {
    return this.lecturerModel.count();
  }
}
