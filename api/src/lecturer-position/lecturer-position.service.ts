import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LecturerPosition } from './lecturer-position.model';
import { COMMON_SELECT_ATTRIBUTES } from '../common/common.resource';
import { LPO_ERROR_RESOURCE, LPO_MODEL_RESOURCE } from './lecturer-position.resource';

const findAttributes = [...COMMON_SELECT_ATTRIBUTES, LPO_MODEL_RESOURCE.FIELD_NAME.TITLE];

@Injectable()
export class LecturerPositionService {
  constructor(
    @InjectModel(LecturerPosition)
    private lecturerPositionModel: typeof LecturerPosition
  ) {}

  public async findAll(offset: number, limit: number): Promise<LecturerPosition[]> {
    return this.lecturerPositionModel.findAll({
      offset,
      limit,
      attributes: findAttributes
    });
  }

  public async findById(id: number): Promise<LecturerPosition> {
    const lecturePosition: LecturerPosition | null = await this.lecturerPositionModel.findByPk(id, {
      attributes: findAttributes
    });

    if (!lecturePosition) {
      throw new BadRequestException(LPO_ERROR_RESOURCE.ERR_1);
    }

    return lecturePosition;
  }

  public async create(lecturerPosition: LecturerPosition): Promise<void> {
    await this.lecturerPositionModel.create(lecturerPosition);
  }

  public async updateById(id: number, lecturerPosition: LecturerPosition): Promise<void> {
    const currentLecturerPosition: LecturerPosition = await this.findById(id);
    console.log(currentLecturerPosition.id);
    await currentLecturerPosition.update(lecturerPosition);
  }

  public async deleteById(id: number): Promise<void> {
    const currentLecturerPosition: LecturerPosition = await this.findById(id);
    await currentLecturerPosition.destroy();
  }

  public async getLecturerPositionMount(): Promise<number> {
    return this.lecturerPositionModel.count();
  }

  public async checkLecturerPositionExistedById(id: number): Promise<void> {
    if ((await this.lecturerPositionModel.count({ where: { id } })) === 0) {
      throw new BadRequestException(LPO_ERROR_RESOURCE.ERR_1);
    }
  }
}
