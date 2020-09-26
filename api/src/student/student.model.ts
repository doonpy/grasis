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
      fields: [STD_MODEL_RESOURCE.FIELD_NAME.STUDENT_ID],
      name: STD_MODEL_RESOURCE.INDEX_NAME.STUDENT_ID,
      unique: true,
    },
  ],
})
export class Student extends Model<Student> {
  @BelongsTo(() => User, {
    foreignKey: 'id',
    as: 'userDetail',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  id!: number;

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
