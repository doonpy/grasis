import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { COMMON_ENTITY_OPTIONS, CommonColumn } from '../common/common.resource';
import { LecturerEntity } from '../lecturer/lecturer.entity';
import { Lecturer } from '../lecturer/lecturer.type';
import { TopicStateBaseEntity } from '../topic/entities/topic-state-base.entity';
import { StateResult } from '../topic/topic.resource';
import { REVIEW_TABLE, ReviewColumn } from './review.resource';

@Entity({ ...COMMON_ENTITY_OPTIONS, name: REVIEW_TABLE })
export class ReviewEntity extends TopicStateBaseEntity {
  @Column({
    name: ReviewColumn.RESULT,
    type: 'tinyint',
    default: StateResult.NOT_DECIDED
  })
  public result!: StateResult;

  @Column({
    name: ReviewColumn.REVIEWER_ID,
    type: 'int',
    nullable: true
  })
  public reviewerId!: number | null;

  @ManyToOne(() => LecturerEntity, (lecturer) => lecturer)
  @JoinColumn({ name: ReviewColumn.REVIEWER_ID, referencedColumnName: CommonColumn.ID })
  public reviewer!: Lecturer | null;
}
