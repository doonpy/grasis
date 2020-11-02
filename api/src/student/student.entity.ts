import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';

import { CommonEntity } from '../common/common.entity';
import {
  COMMON_ENTITY_OPTIONS,
  CommonColumn,
  commonStringColumnOptions
} from '../common/common.resource';
import { ThesisStudentEntity } from '../thesis/thesis-student/thesis-student.entity';
import { ThesisStudent } from '../thesis/thesis-student/thesis-student.interface';
import { ThesisStudentColumn } from '../thesis/thesis-student/thesis-student.resource';
import { TopicStudentEntity } from '../topic/topic-student/topic_student.entity';
import { TopicStudent } from '../topic/topic-student/topic-student.interface';
import { TopicStudentColumn } from '../topic/topic-student/topic-student.resouce';
import { UserEntity } from '../user/user.entity';
import { User } from '../user/user.interface';
import { IsGraduate, STUDENT_TABLE, StudentColumn } from './student.resource';

@Entity({ ...COMMON_ENTITY_OPTIONS, name: STUDENT_TABLE })
export class StudentEntity extends CommonEntity {
  @PrimaryColumn({ name: CommonColumn.ID, type: 'int' })
  public id!: number;

  @Column({
    name: StudentColumn.STUDENT_ID,
    type: 'char',
    length: 8,
    nullable: true,
    ...commonStringColumnOptions
  })
  public studentId!: string | null;

  @Column({
    name: StudentColumn.SCHOOL_YEAR,
    type: 'varchar',
    length: 10,
    nullable: true,
    ...commonStringColumnOptions
  })
  public schoolYear!: string | null;

  @Column({
    name: StudentColumn.STUDENT_CLASS,
    type: 'varchar',
    length: 20,
    nullable: true,
    ...commonStringColumnOptions
  })
  public studentClass!: string | null;

  @Column({
    name: StudentColumn.IS_GRADUATE,
    type: 'tinyint',
    default: IsGraduate.FALSE,
    nullable: true
  })
  public isGraduate!: IsGraduate | null;

  @OneToMany(() => ThesisStudentEntity, ({ student }) => student, { cascade: true })
  @JoinColumn({ name: CommonColumn.ID, referencedColumnName: ThesisStudentColumn.STUDENT_ID })
  public theses!: ThesisStudent[];

  @OneToOne(() => UserEntity, (user) => user, { cascade: true })
  @JoinColumn({ name: CommonColumn.ID, referencedColumnName: CommonColumn.ID })
  public user!: User;

  @OneToMany(() => TopicStudentEntity, ({ student }) => student)
  @JoinColumn({ name: CommonColumn.ID, referencedColumnName: TopicStudentColumn.STUDENT_ID })
  public topics!: TopicStudent[];
}
