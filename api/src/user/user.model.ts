import {
  COMMON_TABLE_OPTIONS,
  Gender,
  UserStatus,
} from '../common/common.resource';
import { Table, Model, Column, DataType } from 'sequelize-typescript';
import { USER_MODEL_RESOURCE } from './user.resource';

@Table({
  ...COMMON_TABLE_OPTIONS,
  tableName: USER_MODEL_RESOURCE.TABLE_NAME,
  modelName: USER_MODEL_RESOURCE.MODEL_NAME,
  indexes: [
    {
      fields: [USER_MODEL_RESOURCE.FIELD_NAME.USERNAME],
      name: USER_MODEL_RESOURCE.INDEX_NAME.USERNAME,
      unique: true,
    },
  ],
})
export class User extends Model<User> {
  @Column({
    type: DataType.STRING({ length: 50 }),
    allowNull: false,
  })
  username!: string;

  @Column({
    type: DataType.STRING({ length: 40 }),
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.STRING({ length: 50 }),
    allowNull: false,
  })
  firstname!: string;

  @Column({
    type: DataType.STRING({ length: 50 }),
    allowNull: false,
  })
  lastname!: string;

  @Column({
    type: DataType.TINYINT,
    allowNull: true,
  })
  gender!: Gender;

  @Column({
    type: DataType.STRING({ length: 100 }),
    allowNull: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING({ length: 100 }),
    allowNull: true,
  })
  address!: string;

  @Column({
    type: DataType.CHAR({ length: 10 }),
    allowNull: true,
  })
  phone!: string;

  @Column({
    type: DataType.TINYINT,
    allowNull: false,
    defaultValue: UserStatus.ACTIVE,
  })
  status!: UserStatus;
}
