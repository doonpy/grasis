import { COMMON_TABLE_OPTIONS } from '../common/common.resource';
import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { USER_MODEL_RESOURCE } from './user.resource';

export enum Gender {
  MALE = 0,
  FEMALE = 1
}

export enum UserStatus {
  INACTIVE = 0,
  ACTIVE = 1
}

@Table({
  ...COMMON_TABLE_OPTIONS,
  paranoid: true,
  tableName: USER_MODEL_RESOURCE.TABLE_NAME,
  modelName: USER_MODEL_RESOURCE.MODEL_NAME,
  indexes: [
    {
      fields: [USER_MODEL_RESOURCE.FIELD_NAME.USERNAME],
      name: USER_MODEL_RESOURCE.INDEX_NAME.USERNAME,
      unique: true
    }
  ]
})
export class User extends Model<User> {
  @Column({
    type: DataType.STRING({ length: 50 }),
    allowNull: false
  })
  username!: string;

  @Column({
    type: DataType.STRING({ length: 40 }),
    allowNull: false
  })
  password!: string;

  @Column({
    type: DataType.STRING({ length: 50 })
  })
  firstname!: string;

  @Column({
    type: DataType.STRING({ length: 50 })
  })
  lastname!: string;

  @Column({
    type: DataType.TINYINT
  })
  gender!: Gender;

  @Column({
    type: DataType.STRING({ length: 100 })
  })
  email!: string;

  @Column({
    type: DataType.STRING({ length: 100 })
  })
  address!: string;

  @Column({
    type: DataType.CHAR({ length: 10 })
  })
  phone!: string;

  @Column({
    type: DataType.TINYINT,
    allowNull: false,
    defaultValue: UserStatus.ACTIVE
  })
  status!: UserStatus;
}
