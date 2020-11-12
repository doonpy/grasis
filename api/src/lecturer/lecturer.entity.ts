import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';

import { CommonEntity } from '../common/common.entity';
import {
  COMMON_ENTITY_OPTIONS,
  CommonColumn,
  commonStringColumnOptions
} from '../common/common.resource';
import { ThesisLecturerEntity } from '../thesis/thesis-lecturer/thesis-lecturer.entity';
import { ThesisLecturerColumn } from '../thesis/thesis-lecturer/thesis-lecturer.resource';
import { ThesisLecturer } from '../thesis/thesis-lecturer/thesis-lecturer.type';
import { UserEntity } from '../user/user.entity';
import { User } from '../user/user.type';
import { LECTURER_TABLE, LecturerColumn } from './lecturer.resource';
import { LecturerForFastView } from './lecturer.type';

@Entity({ ...COMMON_ENTITY_OPTIONS, name: LECTURER_TABLE })
export class LecturerEntity extends CommonEntity {
  @PrimaryColumn({ name: CommonColumn.ID, type: 'int' })
  public id!: number;

  @Column({
    name: LecturerColumn.LECTURER_ID,
    type: 'varchar',
    length: 4,
    nullable: true,
    ...commonStringColumnOptions
  })
  public lecturerId!: string | null;

  @Column({
    name: LecturerColumn.POSITION,
    type: 'varchar',
    length: 255,
    nullable: true,
    ...commonStringColumnOptions
  })
  public position!: string | null;

  @Column({
    name: LecturerColumn.LEVEL,
    type: 'varchar',
    length: 255,
    nullable: true,
    ...commonStringColumnOptions
  })
  public level!: string | null;

  @OneToMany(() => ThesisLecturerEntity, ({ lecturer }) => lecturer)
  @JoinColumn({ name: CommonColumn.ID, referencedColumnName: ThesisLecturerColumn.LECTURER_ID })
  public theses!: ThesisLecturer[];

  @OneToOne(() => UserEntity, { cascade: true })
  @JoinColumn({ name: CommonColumn.ID, referencedColumnName: CommonColumn.ID })
  public user!: User;

  public convertToFastView(): LecturerForFastView {
    return {
      id: this.id,
      deletedAt: this.deletedAt,
      lecturerId: this.lecturerId,
      firstname: this.user.firstname,
      lastname: this.user.lastname
    };
  }
}
