import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { COMMON_ENTITY_OPTIONS, CommonColumn } from '../common/common.resource';
import { CouncilEntity } from '../council/council.entity';
import { Council } from '../council/council.type';
import { TopicStateBaseEntity } from '../topic/entities/topic-state-base.entity';
import { DEFENSE_TABLE, DefenseColumn } from './defense.resource';

@Entity({ ...COMMON_ENTITY_OPTIONS, name: DEFENSE_TABLE })
export class DefenseEntity extends TopicStateBaseEntity {
  @Column({
    name: DefenseColumn.COUNCIL_ID,
    type: 'int',
    nullable: true
  })
  public councilId!: number | null;

  @ManyToOne(() => CouncilEntity, (council) => council)
  @JoinColumn({ name: DefenseColumn.COUNCIL_ID, referencedColumnName: CommonColumn.ID })
  public council!: Council | null;
}
