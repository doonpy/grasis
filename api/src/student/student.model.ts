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
      fields: [STD_MODEL_RESOURCE.FIELD_NAME.USER_ID],
      name: STD_MODEL_RESOURCE.INDEX_NAME.USER_ID,
      unique: true,
    },
    {
      fields: [STD_MODEL_RESOURCE.FIELD_NAME.STUDENT_ID],
      name: STD_MODEL_RESOURCE.INDEX_NAME.STUDENT_ID,
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
