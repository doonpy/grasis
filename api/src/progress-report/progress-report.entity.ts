import { Column, Entity } from 'typeorm';

import { COMMON_ENTITY_OPTIONS } from '../common/common.resource';
import { TopicStateBaseEntity } from '../topic/entities/topic-state-base.entity';
import { StateResult } from '../topic/topic.resource';
import { PROGRESS_REPORT_TABLE, ProgressReportColumn } from './progress-report.resource';

@Entity({ ...COMMON_ENTITY_OPTIONS, name: PROGRESS_REPORT_TABLE })
export class ProgressReportEntity extends TopicStateBaseEntity {
  @Column({
    name: ProgressReportColumn.RESULT,
    type: 'tinyint',
    default: StateResult.NOT_DECIDED
  })
  public result!: StateResult;
}
