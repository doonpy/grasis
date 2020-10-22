import { Column } from 'typeorm';

import { CommonColumn } from './common.resource';

export abstract class CommonEntity {
  @Column({ name: CommonColumn.DELETED_AT, type: 'datetime2', nullable: true })
  public deletedAt!: Date;
}
