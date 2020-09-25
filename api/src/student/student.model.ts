import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { COMMON_TABLE_OPTIONS } from '../common/common.resource';
import { STD_MODEL_RESOURCE } from './student.resource';
import { User } from '../user/user.model';

@Table({
  ...COMMON_TABLE_OPTIONS,
  tableName: STD_MODEL_RESOURCE.TABLE_NAME,
  modelName: STD_MODEL_RESOURCE.MODEL_NAME,
  indexes: [
    {
      fields: ['userId'],
      name: 'idx_userId',
      unique: true,
    },
    {
      fields: ['studentId'],
      name: 'idx_studentId',
      unique: true,
    },
  ],
})
export class Student extends Model<Student> {
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
    primaryKey: true,
  })
  @BelongsTo(() => User, {
    foreignKey: 'userId',
    as: 'userDetail',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  userId!: number;

  @Column({
    type: DataType.CHAR({ length: 8 }),
    allowNull: false,
  })
  studentId!: string;

  @Column({
    type: DataType.CHAR({ length: 4 }),
    allowNull: false,
  })
  schoolYear!: string;
}
