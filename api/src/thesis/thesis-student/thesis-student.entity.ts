import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { CommonEntity } from '../../common/common.entity';
import { COMMON_ENTITY_OPTIONS, CommonColumn } from '../../common/common.resource';
import { StudentEntity } from '../../student/student.entity';
import { Student } from '../../student/student.type';
import { ThesisEntity } from '../thesis.entity';
import { Thesis } from '../thesis.type';
import { THESIS_STUDENT_TABLE, ThesisStudentColumn } from './thesis-student.resource';

@Entity({ ...COMMON_ENTITY_OPTIONS, name: THESIS_STUDENT_TABLE })
export class ThesisStudentEntity extends CommonEntity {
  @PrimaryColumn({ name: ThesisStudentColumn.THESIS_ID, type: 'int' })
  public thesisId!: number;

  @PrimaryColumn({ name: ThesisStudentColumn.STUDENT_ID, type: 'int' })
  public studentId!: number;

  @Column({ name: ThesisStudentColumn.INSTRUCTOR_RESULT, type: 'float', nullable: true })
  public instructorResult!: number | null;

  @Column({ name: ThesisStudentColumn.REVIEW_RESULT, type: 'float', nullable: true })
  public reviewResult!: number | null;

  @Column({ name: ThesisStudentColumn.DEFENSE_RESULT, type: 'float', nullable: true })
  public defenseResult!: number | null;

  @ManyToOne(() => ThesisEntity, ({ students }) => students)
  @JoinColumn({ name: ThesisStudentColumn.THESIS_ID, referencedColumnName: CommonColumn.ID })
  public thesis!: Thesis;

  @ManyToOne(() => StudentEntity, ({ theses }) => theses)
  @JoinColumn({ name: ThesisStudentColumn.STUDENT_ID, referencedColumnName: CommonColumn.ID })
  public student!: Student;
}
