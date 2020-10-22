import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';

import { CommonEntity } from '../common/common.entity';
import { COMMON_ENTITY_OPTIONS, CommonColumn } from '../common/common.resource';
import { ThesisStudentEntity } from '../thesis/thesis-student/thesis-student.entity';
import { ThesisStudent } from '../thesis/thesis-student/thesis-student.interface';
import { ThesisStudentColumn } from '../thesis/thesis-student/thesis-student.resource';
import { UserEntity } from '../user/user.entity';
import { User } from '../user/user.interface';
import { IsGraduate, STUDENT_TABLE, StudentColumn } from './student.resource';

@Entity({ ...COMMON_ENTITY_OPTIONS, name: STUDENT_TABLE })
export class StudentEntity extends CommonEntity {
  @PrimaryColumn({ name: CommonColumn.ID, type: 'int' })
  public id!: number;

  @Column({
    name: StudentColumn.STUDENT_ID,
    type: 'nchar',
    length: 8,
    nullable: true
  })
  public studentId!: string | null;

  @Column({
    name: StudentColumn.SCHOOL_YEAR,
    type: 'nvarchar',
    length: 10,
    nullable: true
  })
  public schoolYear!: string | null;

  @Column({
    name: StudentColumn.STUDENT_CLASS,
    type: 'nvarchar',
    length: 20,
    nullable: true
  })
  public studentClass!: string | null;

  @Column({
    name: StudentColumn.IS_GRADUATE,
    type: 'tinyint',
    default: IsGraduate.FALSE,
    nullable: true
  })
  public isGraduate!: string | null;

  @CreateDateColumn({ name: CommonColumn.CREATED_AT })
  public createdAt!: Date;

  @UpdateDateColumn({ name: CommonColumn.UPDATED_AT })
  public updatedAt!: Date;

  @OneToMany(() => ThesisStudentEntity, ({ student }) => student, { cascade: true })
  @JoinColumn({ name: CommonColumn.ID, referencedColumnName: ThesisStudentColumn.STUDENT_ID })
  public theses!: ThesisStudent[];

  @OneToOne(() => UserEntity, ({ student }) => student, { cascade: true })
  @JoinColumn({ name: CommonColumn.ID, referencedColumnName: CommonColumn.ID })
  public user!: User;
}
