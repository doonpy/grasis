import { Column, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { CommonEntity } from '../../common/common.entity';
import { CommonColumn, commonStringColumnOptions } from '../../common/common.resource';
import { TopicStateBaseColumn } from '../topic.resource';
import { Topic } from '../topic.type';
import { TopicEntity } from './topic.entity';

export abstract class TopicStateBaseEntity extends CommonEntity {
  @PrimaryColumn({ name: CommonColumn.ID, type: 'int' })
  public id!: number;

  @Column({
    name: TopicStateBaseColumn.TIME,
    type: 'datetime'
  })
  public time!: Date;

  @Column({
    ...commonStringColumnOptions,
    name: TopicStateBaseColumn.PLACE,
    type: 'varchar',
    length: 100,
    nullable: true
  })
  public place!: string | null;

  @Column({
    ...commonStringColumnOptions,
    name: TopicStateBaseColumn.NOTE,
    type: 'text',
    nullable: true
  })
  public note!: string | null;

  @OneToOne(() => TopicEntity, (topic) => topic)
  @JoinColumn({ name: CommonColumn.ID, referencedColumnName: CommonColumn.ID })
  public topic!: Topic;
}
