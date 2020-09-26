import { BelongsTo, Column, DataType, Model, Table } from 'sequelize-typescript';
import { COMMON_TABLE_OPTIONS } from '../common/common.resource';
import { LEC_MODEL_RESOURCE } from './lecturer.resource';
import { User } from '../user/user.model';
import { LecturerPosition } from '../lecturer-position/lecturer-position.model';

export enum IsAdmin {
  FALSE = 0,
  TRUE = 1
}

@Table({
  ...COMMON_TABLE_OPTIONS,
  paranoid: true,
  tableName: LEC_MODEL_RESOURCE.TABLE_NAME,
  modelName: LEC_MODEL_RESOURCE.MODEL_NAME,
  indexes: [
    {
      fields: [LEC_MODEL_RESOURCE.FIELD_NAME.LECTURER_ID],
      name: LEC_MODEL_RESOURCE.INDEX_NAME.LECTURER_ID,
      unique: true
    },
    {
      fields: [LEC_MODEL_RESOURCE.FIELD_NAME.IS_ADMIN],
      name: LEC_MODEL_RESOURCE.INDEX_NAME.IS_ADMIN
    }
  ]
})
export class Lecturer extends Model<Lecturer> {
  @BelongsTo(() => User, {
    foreignKey: 'id',
    as: 'userDetail',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  id!: number;

  @Column({
    type: DataType.CHAR({ length: 4 })
  })
  lecturerId!: string;

  @Column({
    type: DataType.INTEGER
  })
  @BelongsTo(() => LecturerPosition, {
    foreignKey: 'id',
    as: 'position'
  })
  positionId!: number;

  @Column({
    type: DataType.STRING({ length: 255 })
  })
  level!: string;

  @Column({
    type: DataType.TINYINT,
    allowNull: false,
    defaultValue: IsAdmin.FALSE
  })
  isAdmin!: number;
}
