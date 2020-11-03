import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { CommonEntity } from '../common/common.entity';
import {
  COMMON_ENTITY_OPTIONS,
  CommonColumn,
  commonStringColumnOptions
} from '../common/common.resource';
import { LecturerEntity } from '../lecturer/lecturer.entity';
import { Lecturer } from '../lecturer/lecturer.interface';
import { ThesisEntity } from '../thesis/thesis.entity';
import { Thesis } from '../thesis/thesis.interface';
import { TopicStateEntity } from './topic-state/topic-state.entity';
import { TopicState } from './topic-state/topic-state.interface';
import { TopicStateAction, TopicStateColumn } from './topic-state/topic-state.resource';
import { TopicStudentEntity } from './topic-student/topic_student.entity';
import { TopicStudent } from './topic-student/topic-student.interface';
import { TopicStudentColumn } from './topic-student/topic-student.resouce';
import { TOPIC_TABLE, TopicColumn, TopicRegisterStatus } from './topic.resource';

@Entity({ ...COMMON_ENTITY_OPTIONS, name: TOPIC_TABLE })
export class TopicEntity extends CommonEntity {
  @PrimaryGeneratedColumn({ name: CommonColumn.ID })
  public id!: number;

  @Column({ name: TopicColumn.CREATOR_ID, type: 'int' })
  public creatorId!: number;

  @Column({ name: TopicColumn.SUBJECT, type: 'text', ...commonStringColumnOptions })
  public subject!: string;

  @Column({
    name: TopicColumn.DESCRIPTION,
    type: 'text',
    nullable: true,
    ...commonStringColumnOptions
  })
  public description!: string | null;

  @Column({ name: TopicColumn.STATUS, type: 'tinyint', default: TopicStateAction.NEW })
  public status!: TopicStateAction;

  @Column({ name: TopicColumn.APPROVER_ID, type: 'int' })
  public approverId!: number;

  @Column({ name: TopicColumn.THESIS_ID, type: 'int' })
  public thesisId!: number;

  @Column({ name: TopicColumn.MAX_STUDENT, type: 'tinyint', default: 2 })
  public maxStudent!: number;

  @Column({ name: TopicColumn.CURRENT_STUDENT, type: 'tinyint', default: 0 })
  public currentStudent!: number;

  @Column({
    name: TopicColumn.REGISTER_STATUS,
    type: 'tinyint',
    default: TopicRegisterStatus.DISABLE
  })
  public registerStatus!: number;

  @ManyToOne(() => LecturerEntity, (lecturer) => lecturer)
  @JoinColumn({ name: TopicColumn.CREATOR_ID, referencedColumnName: CommonColumn.ID })
  public creator!: Lecturer;

  @ManyToOne(() => LecturerEntity, (lecturer) => lecturer)
  @JoinColumn({ name: TopicColumn.APPROVER_ID, referencedColumnName: CommonColumn.ID })
  public approver!: Lecturer;

  @ManyToOne(() => ThesisEntity, (thesis) => thesis)
  @JoinColumn({ name: TopicColumn.THESIS_ID, referencedColumnName: CommonColumn.ID })
  public thesis!: Thesis;

  @OneToMany(() => TopicStateEntity, ({ topic }) => topic, { cascade: true })
  @JoinColumn({ name: CommonColumn.ID, referencedColumnName: TopicStateColumn.TOPIC_ID })
  public states!: TopicState[];

  @OneToMany(() => TopicStudentEntity, ({ topic }) => topic)
  @JoinColumn({ name: CommonColumn.ID, referencedColumnName: TopicStudentColumn.TOPIC_ID })
  public students!: TopicStudent[];
}
