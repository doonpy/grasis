import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { CommonEntity } from '../common/common.entity';
import {
  COMMON_ENTITY_OPTIONS,
  CommonColumn,
  commonStringColumnOptions
} from '../common/common.resource';
import { StateResult } from '../topic/topic.resource';
import { PROGRESS_REPORT_TABLE, ProgressReportColumn } from './progress-report.resource';

@Entity({ ...COMMON_ENTITY_OPTIONS, name: PROGRESS_REPORT_TABLE })
export class ProgressReportEntity extends CommonEntity {
  @PrimaryGeneratedColumn({ name: CommonColumn.ID, type: 'int' })
  public id!: number;

  @Column({
    name: ProgressReportColumn.TOPIC_ID,
    type: 'int'
  })
  public topicId!: number;

  @Column({
    name: ProgressReportColumn.TIME,
    type: 'datetime'
  })
  public time!: Date;

  @Column({
    ...commonStringColumnOptions,
    name: ProgressReportColumn.PLACE,
    type: 'varchar',
    length: 100,
    nullable: true
  })
  public place!: string | null;

  @Column({
    ...commonStringColumnOptions,
    name: ProgressReportColumn.NOTE,
    type: 'text',
    nullable: true
  })
  public note!: string | null;

  @Column({
    name: ProgressReportColumn.IS_PASSED,
    type: 'tinyint',
    default: StateResult.NOT_DECIDED
  })
  public isPassed!: StateResult;
}
