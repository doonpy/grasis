import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { COMMON_TABLE_OPTIONS } from '../common/common.resource';
import { LPO_MODEL_RESOURCE } from './lecturer-position.resource';
import { Lecturer } from '../lecturer/lecturer.model';

@Table({
  ...COMMON_TABLE_OPTIONS,
  tableName: LPO_MODEL_RESOURCE.TABLE_NAME,
  modelName: LPO_MODEL_RESOURCE.MODEL_NAME,
})
export class LecturerPosition extends Model<LecturerPosition> {
  @HasMany(() => Lecturer, {
    foreignKey: 'positionId',
    as: 'lecturers',
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;
}
