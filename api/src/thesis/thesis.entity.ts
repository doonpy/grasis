import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { CommonEntity } from '../common/common.entity';
import {
  COMMON_ENTITY_OPTIONS,
  CommonColumn,
  commonStringColumnOptions
} from '../common/common.resource';
import { LecturerEntity } from '../lecturer/lecturer.entity';
import { Lecturer } from '../lecturer/lecturer.interface';
import { TopicEntity } from '../topic/topic.entity';
import { Topic } from '../topic/topic.interface';
import { TopicColumn } from '../topic/topic.resource';
import { ThesisLecturerEntity } from './thesis-lecturer/thesis-lecturer.entity';
import { ThesisLecturer } from './thesis-lecturer/thesis-lecturer.interface';
import { ThesisLecturerColumn } from './thesis-lecturer/thesis-lecturer.resource';
import { ThesisStudentEntity } from './thesis-student/thesis-student.entity';
import { ThesisStudent } from './thesis-student/thesis-student.interface';
import { ThesisStudentColumn } from './thesis-student/thesis-student.resource';
import { THESIS_TABLE, ThesisColumn, ThesisState, ThesisStatus } from './thesis.resource';

@Entity({ ...COMMON_ENTITY_OPTIONS, name: THESIS_TABLE })
export class ThesisEntity extends CommonEntity {
  @PrimaryGeneratedColumn({ name: CommonColumn.ID, type: 'int' })
  public id!: number;

  @Column({
    name: ThesisColumn.SUBJECT,
    type: 'varchar',
    length: 100,
    ...commonStringColumnOptions
  })
  public subject!: number;

  @Column({ name: ThesisColumn.CREATOR_ID, type: 'int' })
  public creatorId!: number;

  @Column({ name: ThesisColumn.START_TIME, type: 'datetime' })
  public startTime!: string;

  @Column({ name: ThesisColumn.END_TIME, type: 'datetime' })
  public endTime!: string;

  @Column({
    name: ThesisColumn.STATE,
    type: 'tinyint',
    default: ThesisState.NOT_START
  })
  public state!: ThesisState;

  @Column({ name: ThesisColumn.LECTURER_TOPIC_REGISTER, type: 'datetime' })
  public lecturerTopicRegister!: string;

  @Column({ name: ThesisColumn.STUDENT_TOPIC_REGISTER, type: 'datetime' })
  public studentTopicRegister!: string;

  @Column({ name: ThesisColumn.PROGRESS_REPORT, type: 'datetime' })
  public progressReport!: string;

  @Column({ name: ThesisColumn.REVIEW, type: 'datetime' })
  public review!: string;

  @Column({ name: ThesisColumn.DEFENSE, type: 'datetime' })
  public defense!: string;

  @Column({ name: ThesisColumn.STATUS, type: 'int', default: ThesisStatus.INACTIVE })
  public status!: ThesisStatus;

  @OneToMany(() => ThesisStudentEntity, ({ thesis }) => thesis, { cascade: true })
  @JoinColumn({ name: CommonColumn.ID, referencedColumnName: ThesisStudentColumn.THESIS_ID })
  public students!: ThesisStudent[];

  @OneToMany(() => ThesisLecturerEntity, ({ thesis }) => thesis, { cascade: true })
  @JoinColumn({ name: CommonColumn.ID, referencedColumnName: ThesisLecturerColumn.THESIS_ID })
  public lecturers!: ThesisLecturer[];

  @ManyToOne(() => LecturerEntity, ({ theses }) => theses, {
    cascade: true
  })
  @JoinColumn({ name: ThesisColumn.CREATOR_ID, referencedColumnName: CommonColumn.ID })
  public creator!: Lecturer | null;

  @OneToMany(() => TopicEntity, ({ thesis }) => thesis)
  @JoinColumn({ name: CommonColumn.ID, referencedColumnName: TopicColumn.THESIS_ID })
  public topics!: Topic[];
}
