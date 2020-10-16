import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';

import { CommonEntity } from '../common/common.entity';
import { COMMON_ENTITY_OPTIONS } from '../common/common.resource';
import { UserEntity } from '../user/user.entity';
import { IsGraduate, STD_ENTITY_RESOURCE } from './student.resource';

@Entity({ ...COMMON_ENTITY_OPTIONS, name: STD_ENTITY_RESOURCE.TABLE_NAME })
export class StudentEntity extends CommonEntity {
  @PrimaryColumn({ type: 'int' })
  @OneToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  id!: number;

  @Column({
    type: 'nchar',
    length: 8,
    nullable: true
  })
  studentId!: string;

  @Column({
    type: 'nvarchar',
    length: 10,
    nullable: true
  })
  schoolYear!: string;

  @Column({
    type: 'nvarchar',
    length: 20,
    nullable: true
  })
  class!: string;

  @Column({
    type: 'tinyint',
    default: IsGraduate.FALSE,
    nullable: true
  })
  isGraduate!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
