import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { CommonEntity } from '../../common/common.entity';
import { COMMON_ENTITY_OPTIONS, CommonColumn } from '../../common/common.resource';
import { StudentEntity } from '../../student/student.entity';
import { Student } from '../../student/student.type';
import { TopicEntity } from '../entities/topic.entity';
import { Topic } from '../topic.type';
import {
  TOPIC_STUDENT_TABLE,
  TopicStudentColumn,
  TopicStudentStatus
} from './topic-student.resouce';

@Entity({ ...COMMON_ENTITY_OPTIONS, name: TOPIC_STUDENT_TABLE })
export class TopicStudentEntity extends CommonEntity {
  @PrimaryColumn({ name: TopicStudentColumn.TOPIC_ID, type: 'int' })
  public topicId!: number;

  @PrimaryColumn({ name: TopicStudentColumn.STUDENT_ID, type: 'int' })
  public studentId!: number;

  @Column({ name: TopicStudentColumn.STATUS, type: 'tinyint', default: TopicStudentStatus.PENDING })
  public status!: TopicStudentStatus;

  @ManyToOne(() => TopicEntity, ({ students }) => students)
  @JoinColumn({ name: TopicStudentColumn.TOPIC_ID, referencedColumnName: CommonColumn.ID })
  public topic!: Topic;

  @ManyToOne(() => StudentEntity, ({ topics }) => topics)
  @JoinColumn({ name: TopicStudentColumn.STUDENT_ID, referencedColumnName: CommonColumn.ID })
  public student!: Student;
}
