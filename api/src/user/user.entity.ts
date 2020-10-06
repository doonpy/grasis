import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { CommonEntity } from '../common/common.entity';
import { COMMON_ENTITY_OPTIONS } from '../common/common.resource';
import { Gender, IsAdmin, USER_ENTITY_RESOURCE, UserStatus } from './user.resource';

@Entity({ ...COMMON_ENTITY_OPTIONS, name: USER_ENTITY_RESOURCE.TABLE_NAME })
export class User extends CommonEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Column({ type: 'nvarchar', length: 50 })
  username!: string;

  @Column({
    type: 'nchar',
    length: 40
  })
  password!: string;

  @Column({
    type: 'nvarchar',
    length: 50,
    nullable: true
  })
  firstname!: string;

  @Column({
    type: 'nvarchar',
    length: 50,
    nullable: true
  })
  lastname!: string;

  @Column({
    type: 'tinyint',
    nullable: true
  })
  gender!: Gender;

  @Column({
    type: 'nvarchar',
    length: 100,
    nullable: true
  })
  email!: string;

  @Column({
    type: 'nvarchar',
    length: 100,
    nullable: true
  })
  address!: string;

  @Column({
    type: 'nchar',
    length: 10,
    nullable: true
  })
  phone!: string;

  @Column({
    type: 'tinyint',
    default: UserStatus.ACTIVE,
    nullable: true
  })
  status!: UserStatus;

  @Column({
    type: 'tinyint',
    default: IsAdmin.FALSE,
    nullable: true
  })
  isAdmin!: IsAdmin;

  @Column({
    type: 'tinyint',
    nullable: true
  })
  userType!: number;
}
