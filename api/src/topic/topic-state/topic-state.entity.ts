import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CommonEntity } from '../../common/common.entity';
import {
  COMMON_ENTITY_OPTIONS,
  CommonColumn,
  commonStringColumnOptions
} from '../../common/common.resource';
import { LecturerEntity } from '../../lecturer/lecturer.entity';
import { Lecturer } from '../../lecturer/lecturer.type';
import { TopicEntity } from '../entities/topic.entity';
import { Topic } from '../topic.type';
import { TOPIC_STATE_TABLE, TopicStateAction, TopicStateColumn } from './topic-state.resource';

@Entity({ ...COMMON_ENTITY_OPTIONS, name: TOPIC_STATE_TABLE })
export class TopicStateEntity extends CommonEntity {
  @PrimaryGeneratedColumn({ name: CommonColumn.ID })
  public id!: number;

  @Column({ name: TopicStateColumn.TOPIC_ID, type: 'int' })
  public topicId!: number;

  @Column({ name: TopicStateColumn.PROCESSOR_ID, type: 'int' })
  public processorId!: number;

  @Column({
    name: TopicStateColumn.NOTE,
    type: 'text',
    nullable: true,
    ...commonStringColumnOptions
  })
  public note!: string | null;

  @Column({ name: TopicStateColumn.ACTION, type: 'tinyint', default: TopicStateAction.NEW })
  public action!: TopicStateAction;

  @ManyToOne(() => TopicEntity, ({ states }) => states)
  @JoinColumn({
    name: TopicStateColumn.TOPIC_ID,
    referencedColumnName: CommonColumn.ID
  })
  public topic!: Topic;

  @ManyToOne(() => LecturerEntity, (lecturer) => lecturer)
  @JoinColumn({
    name: TopicStateColumn.PROCESSOR_ID,
    referencedColumnName: CommonColumn.ID
  })
  public processor!: Lecturer;
}
