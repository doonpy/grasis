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
import { LEC_ENTITY_RESOURCE } from './lecturer.resource';

@Entity({ ...COMMON_ENTITY_OPTIONS, name: LEC_ENTITY_RESOURCE.TABLE_NAME })
export class Lecturer extends CommonEntity {
  @PrimaryColumn({ type: 'int' })
  @OneToOne(() => User, (user) => user.id, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  id!: number;

  @Column({
    type: 'char',
    length: 4,
    nullable: true
  })
  lecturerId!: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true
  })
  position!: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true
  })
  level!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
