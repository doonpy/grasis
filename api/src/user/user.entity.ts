import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { CommonEntity } from '../common/common.entity';
import {
  COMMON_ENTITY_OPTIONS,
  CommonColumn,
  commonStringColumnOptions
} from '../common/common.resource';
import { Gender, IsAdmin, USER_TABLE, UserColumn, UserStatus, UserType } from './user.resource';

@Entity({ ...COMMON_ENTITY_OPTIONS, name: USER_TABLE })
export class UserEntity extends CommonEntity {
  @PrimaryGeneratedColumn({ name: CommonColumn.ID, type: 'int' })
  public id!: number;

  @Column({ name: UserColumn.USERNAME, type: 'varchar', length: 50, ...commonStringColumnOptions })
  public username!: string;

  @Column({
    name: UserColumn.PASSWORD,
    type: 'char',
    length: 40,
    select: false,
    ...commonStringColumnOptions
  })
  public password!: string;

  @Column({
    name: UserColumn.FIRSTNAME,
    type: 'varchar',
    length: 50,
    nullable: true,
    ...commonStringColumnOptions
  })
  public firstname!: string | null;

  @Column({
    name: UserColumn.LASTNAME,
    type: 'varchar',
    length: 50,
    nullable: true,
    ...commonStringColumnOptions
  })
  public lastname!: string | null;

  @Column({ name: UserColumn.GENDER, type: 'tinyint', nullable: true })
  public gender!: Gender;

  @Column({
    name: UserColumn.EMAIL,
    type: 'varchar',
    length: 100,
    nullable: true,
    ...commonStringColumnOptions
  })
  public email!: string | null;

  @Column({
    name: UserColumn.ADDRESS,
    type: 'varchar',
    length: 100,
    nullable: true,
    ...commonStringColumnOptions
  })
  public address!: string | null;

  @Column({
    name: UserColumn.PHONE,
    type: 'char',
    length: 10,
    nullable: true,
    ...commonStringColumnOptions
  })
  public phone!: string | null;

  @Column({ name: UserColumn.STATUS, type: 'tinyint', default: UserStatus.ACTIVE })
  public status!: UserStatus;

  @Column({ name: UserColumn.IS_ADMIN, type: 'tinyint', default: IsAdmin.FALSE })
  public isAdmin!: IsAdmin;

  @Column({ name: UserColumn.USER_TYPE, type: 'tinyint' })
  public userType!: UserType;
}
