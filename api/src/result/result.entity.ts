import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CommonEntity } from '../common/common.entity';
import {
  COMMON_ENTITY_OPTIONS,
  CommonColumn,
  commonStringColumnOptions
} from '../common/common.resource';
import { LecturerEntity } from '../lecturer/lecturer.entity';
import { Lecturer } from '../lecturer/lecturer.type';
import { StudentEntity } from '../student/student.entity';
import { Student } from '../student/student.type';
import { TopicEntity } from '../topic/entities/topic.entity';
import { Topic } from '../topic/topic.type';
import { RESULT_TABLE, ResultColumn, ResultStatus, ResultType } from './result.resource';
import { ResultPoint } from './result.type';

@Entity({ ...COMMON_ENTITY_OPTIONS, name: RESULT_TABLE })
export class ResultEntity extends CommonEntity {
  @PrimaryGeneratedColumn({ name: CommonColumn.ID })
  public id!: number;

  @Column({
    name: ResultColumn.TOPIC_ID,
    type: 'int'
  })
  public topicId!: number;

  @Column({
    name: ResultColumn.STUDENT_ID,
    type: 'int'
  })
  public studentId!: number;

  @Column({
    name: ResultColumn.CREATOR_ID,
    type: 'int'
  })
  public creatorId!: number;

  @Column({
    name: ResultColumn.NOTE,
    type: 'text',
    nullable: true,
    ...commonStringColumnOptions
  })
  public note!: string | null;

  @Column({
    name: ResultColumn.TYPE,
    type: 'tinyint'
  })
  public type!: ResultType;

  @Column({
    name: ResultColumn.POINT,
    type: 'json'
  })
  public point!: ResultPoint[] | null;

  @Column({
    name: ResultColumn.STATUS,
    type: 'tinyint',
    default: ResultStatus.UNLOCK
  })
  public status!: ResultStatus;

  @ManyToOne(() => TopicEntity, (topic) => topic)
  @JoinColumn({ name: ResultColumn.TOPIC_ID, referencedColumnName: CommonColumn.ID })
  public topic!: Topic;

  @ManyToOne(() => StudentEntity, (student) => student)
  @JoinColumn({ name: ResultColumn.STUDENT_ID, referencedColumnName: CommonColumn.ID })
  public student!: Student;

  @ManyToOne(() => LecturerEntity, (lecturer) => lecturer)
  @JoinColumn({ name: ResultColumn.CREATOR_ID, referencedColumnName: CommonColumn.ID })
  public creator!: Lecturer;
}
