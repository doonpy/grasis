import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { COMMON_ENTITY_OPTIONS, CommonColumn } from '../common/common.resource';
import { LecturerEntity } from '../lecturer/lecturer.entity';
import { Lecturer } from '../lecturer/lecturer.interface';
import { ThesisStudentEntity } from './thesis-student/thesis-student.entity';
import { ThesisStudent } from './thesis-student/thesis-student.interface';
import { ThesisStudentColumn } from './thesis-student/thesis-student.resource';
import {
  THESIS_LECTURER_TABLE,
  THESIS_TABLE,
  ThesisColumn,
  ThesisLecturerColumn,
  ThesisState,
  ThesisStatus
} from './thesis.resource';

@Entity({ ...COMMON_ENTITY_OPTIONS, name: THESIS_TABLE })
export class ThesisEntity {
  @PrimaryGeneratedColumn({ name: CommonColumn.ID, type: 'int' })
  public id!: number;

  @Column({ name: ThesisColumn.SUBJECT, type: 'nvarchar', length: 100 })
  public subject!: number;

  @Column({ name: ThesisColumn.CREATOR_ID, type: 'int' })
  public creatorId!: number;

  @Column({ name: ThesisColumn.START_TIME, type: 'datetime2' })
  public startTime!: string;

  @Column({ name: ThesisColumn.END_TIME, type: 'datetime2' })
  public endTime!: string;

  @Column({
    name: ThesisColumn.STATE,
    type: 'tinyint',
    default: ThesisState.LECTURER_TOPIC_REGISTER
  })
  public state!: ThesisState;

  @Column({ name: ThesisColumn.LECTURER_TOPIC_REGISTER, type: 'datetime2' })
  public lecturerTopicRegister!: string;

  @Column({ name: ThesisColumn.STUDENT_TOPIC_REGISTER, type: 'datetime2' })
  public studentTopicRegister!: string;

  @Column({ name: ThesisColumn.PROGRESS_REPORT, type: 'datetime2' })
  public progressReport!: string;

  @Column({ name: ThesisColumn.REVIEW, type: 'datetime2' })
  public review!: string;

  @Column({ name: ThesisColumn.DEFENSE, type: 'datetime2' })
  public defense!: string;

  @Column({ name: ThesisColumn.STATUS, type: 'int', default: ThesisStatus.INACTIVE })
  public status!: ThesisStatus;

  @CreateDateColumn({ name: CommonColumn.CREATED_AT })
  public createdAt!: string;

  @UpdateDateColumn({ name: CommonColumn.UPDATED_AT })
  public updatedAt!: string;

  @OneToMany(() => ThesisStudentEntity, ({ thesis }) => thesis, { cascade: true })
  @JoinColumn({ name: CommonColumn.ID, referencedColumnName: ThesisStudentColumn.THESIS_ID })
  public students!: ThesisStudent[];

  @ManyToMany(() => LecturerEntity, ({ theses }) => theses, { cascade: true })
  @JoinTable({
    ...COMMON_ENTITY_OPTIONS,
    name: THESIS_LECTURER_TABLE,
    joinColumn: { name: ThesisLecturerColumn.THESIS_ID, referencedColumnName: CommonColumn.ID },
    inverseJoinColumn: {
      name: ThesisLecturerColumn.LECTURER_ID,
      referencedColumnName: CommonColumn.ID
    }
  })
  public lecturers!: Lecturer[];

  @ManyToOne(() => LecturerEntity, ({ theses }) => theses, {
    cascade: true
  })
  @JoinColumn({ name: ThesisColumn.CREATOR_ID, referencedColumnName: CommonColumn.ID })
  public creator!: Lecturer | null;
}
