import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { CommonColumn } from './common.resource';

export abstract class CommonEntity {
  @Column({ name: CommonColumn.DELETED_AT, type: 'datetime2', nullable: true })
  public deletedAt!: Date | null;

  @CreateDateColumn({ name: CommonColumn.CREATED_AT, nullable: true })
  public createdAt!: Date | null;

  @UpdateDateColumn({ name: CommonColumn.UPDATED_AT, nullable: true })
  public updatedAt!: Date | null;
}
