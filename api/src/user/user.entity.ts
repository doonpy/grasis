import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { CommonEntity } from '../common/common.entity';
import { COMMON_ENTITY_OPTIONS, CommonColumn } from '../common/common.resource';
import { Gender, IsAdmin, USER_TABLE, UserColumn, UserStatus, UserType } from './user.resource';

@Entity({ ...COMMON_ENTITY_OPTIONS, name: USER_TABLE })
export class UserEntity extends CommonEntity {
  @PrimaryGeneratedColumn({ name: CommonColumn.ID, type: 'int' })
  public id!: number;

  @Column({ name: UserColumn.USERNAME, type: 'nvarchar', length: 50 })
  public username!: string;

  @Column({ name: UserColumn.PASSWORD, type: 'nchar', length: 40, select: false })
  public password!: string;

  @Column({ name: UserColumn.FIRSTNAME, type: 'nvarchar', length: 50, nullable: true })
  public firstname!: string | null;

  @Column({ name: UserColumn.LASTNAME, type: 'nvarchar', length: 50, nullable: true })
  public lastname!: string | null;

  @Column({ name: UserColumn.GENDER, type: 'tinyint', nullable: true })
  public gender!: Gender;

  @Column({ name: UserColumn.EMAIL, type: 'nvarchar', length: 100, nullable: true })
  public email!: string | null;

  @Column({ name: UserColumn.ADDRESS, type: 'nvarchar', length: 100, nullable: true })
  public address!: string | null;

  @Column({ name: UserColumn.PHONE, type: 'nchar', length: 10, nullable: true })
  public phone!: string | null;

  @Column({ name: UserColumn.STATUS, type: 'tinyint', default: UserStatus.ACTIVE })
  public status!: UserStatus;

  @Column({ name: UserColumn.IS_ADMIN, type: 'tinyint', default: IsAdmin.FALSE })
  public isAdmin!: IsAdmin;

  @Column({ name: UserColumn.USER_TYPE, type: 'tinyint' })
  public userType!: UserType;
}
