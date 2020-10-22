import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';

import { CommonEntity } from '../common/common.entity';
import { COMMON_ENTITY_OPTIONS, CommonColumn } from '../common/common.resource';
import { ThesisEntity } from '../thesis/thesis.entity';
import { Thesis } from '../thesis/thesis.interface';
import { UserEntity } from '../user/user.entity';
import { User } from '../user/user.interface';
import { LECTURER_TABLE, LecturerColumn } from './lecturer.resource';

@Entity({ ...COMMON_ENTITY_OPTIONS, name: LECTURER_TABLE })
export class LecturerEntity extends CommonEntity {
  @PrimaryColumn({ name: CommonColumn.ID, type: 'int' })
  public id!: number;

  @Column({
    name: LecturerColumn.LECTURER_ID,
    type: 'nchar',
    length: 4,
    nullable: true
  })
  public lecturerId!: string | null;

  @Column({
    name: LecturerColumn.POSITION,
    type: 'nvarchar',
    length: 255,
    nullable: true
  })
  public position!: string | null;

  @Column({
    name: LecturerColumn.LEVEL,
    type: 'nvarchar',
    length: 255,
    nullable: true
  })
  public level!: string | null;

  @CreateDateColumn({ name: CommonColumn.CREATED_AT })
  public createdAt!: Date;

  @UpdateDateColumn({ name: CommonColumn.UPDATED_AT })
  public updatedAt!: Date;

  @ManyToMany(() => ThesisEntity, ({ lecturers }) => lecturers)
  @JoinColumn({ name: CommonColumn.ID, referencedColumnName: CommonColumn.ID })
  public theses!: Thesis[];

  @OneToOne(() => UserEntity, { cascade: true })
  @JoinColumn({ name: CommonColumn.ID, referencedColumnName: CommonColumn.ID })
  public user!: User;
}
