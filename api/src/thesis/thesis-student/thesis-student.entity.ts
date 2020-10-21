import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { COMMON_COLUMN, COMMON_ENTITY_OPTIONS } from '../../common/common.resource';
import { StudentEntity } from '../../student/student.entity';
import { ThesisEntity } from '../thesis.entity';
import { THESIS_STUDENT_COLUMN, THESIS_STUDENT_TABLE } from './thesis-student.resource';

@Entity({ ...COMMON_ENTITY_OPTIONS, name: THESIS_STUDENT_TABLE })
export class ThesisStudentEntity {
  @PrimaryColumn({ name: THESIS_STUDENT_COLUMN.THESIS, type: 'int' })
  @ManyToOne(() => ThesisEntity, (thesis) => thesis.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: THESIS_STUDENT_COLUMN.THESIS, referencedColumnName: COMMON_COLUMN.ID })
  private thesis!: number;

  @PrimaryColumn({ name: THESIS_STUDENT_COLUMN.STUDENT, type: 'int' })
  @ManyToOne(() => StudentEntity, (student) => student.id, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION'
  })
  @JoinColumn({ name: THESIS_STUDENT_COLUMN.STUDENT, referencedColumnName: COMMON_COLUMN.ID })
  private student!: number;

  @Column({ name: THESIS_STUDENT_COLUMN.TOPIC, type: 'int', nullable: true })
  private topic!: number;

  @Column({ name: THESIS_STUDENT_COLUMN.INSTRUCTOR_RESULT, type: 'float', nullable: true })
  private instructorResult!: number;

  @Column({ name: THESIS_STUDENT_COLUMN.REVIEW_RESULT, type: 'float', nullable: true })
  private reviewResult!: number;

  @Column({ name: THESIS_STUDENT_COLUMN.DEFENSE_RESULT, type: 'float', nullable: true })
  private defenseResult!: number;
}
