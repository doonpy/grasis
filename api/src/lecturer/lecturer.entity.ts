import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';

import { CommonEntity } from '../common/common.entity';
import { COMMON_ENTITY_OPTIONS, CommonColumn } from '../common/common.resource';
import { ThesisLecturerEntity } from '../thesis/thesis-lecturer/thesis-lecturer.entity';
import { ThesisLecturer } from '../thesis/thesis-lecturer/thesis-lecturer.interface';
import { ThesisLecturerColumn } from '../thesis/thesis-lecturer/thesis-lecturer.resource';
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

  @OneToMany(() => ThesisLecturerEntity, ({ lecturer }) => lecturer)
  @JoinColumn({ name: CommonColumn.ID, referencedColumnName: ThesisLecturerColumn.LECTURER_ID })
  public theses!: ThesisLecturer[];

  @OneToOne(() => UserEntity, { cascade: true })
  @JoinColumn({ name: CommonColumn.ID, referencedColumnName: CommonColumn.ID })
  public user!: User;
}
