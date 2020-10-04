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
import { User } from '../user/user.entity';
import { STD_ENTITY_RESOURCE } from './student.resource';

@Entity({ ...COMMON_ENTITY_OPTIONS, name: STD_ENTITY_RESOURCE.TABLE_NAME })
export class Student extends CommonEntity {
  @PrimaryColumn({ type: 'int' })
  @OneToOne(() => User, (user) => user.id, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  id!: number;

  @Column({
    type: 'char',
    length: 8,
    nullable: true
  })
  studentId!: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true
  })
  schoolYear!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
