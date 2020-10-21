import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { COMMON_COLUMN, COMMON_ENTITY_OPTIONS } from '../common/common.resource';
import { LecturerEntity } from '../lecturer/lecturer.entity';
import { THESIS_COLUMN, THESIS_STATE, THESIS_STATUS, THESIS_TABLE } from './thesis.resource';

@Entity({ ...COMMON_ENTITY_OPTIONS, name: THESIS_TABLE })
export class ThesisEntity {
  @PrimaryGeneratedColumn({ name: COMMON_COLUMN.ID, type: 'int' })
  public readonly id!: number;

  @Column({ name: THESIS_COLUMN.CREATOR, type: 'int', nullable: true })
  @ManyToOne(() => LecturerEntity, (lecturer) => lecturer.id, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: THESIS_COLUMN.CREATOR, referencedColumnName: COMMON_COLUMN.ID })
  private readonly creator!: number;

  @Column({ name: THESIS_COLUMN.START_TIME, type: 'datetime2' })
  private readonly startTime!: string;

  @Column({ name: THESIS_COLUMN.END_TIME, type: 'datetime2' })
  private readonly endTime!: string;

  @Column({
    name: THESIS_COLUMN.STATE,
    type: 'tinyint',
    default: THESIS_STATE.LECTURER_TOPIC_REGISTER
  })
  private readonly state!: string;

  @Column({ name: THESIS_COLUMN.LECTURER_TOPIC_REGISTER, type: 'datetime2' })
  private readonly lecturerTopicRegister!: string;

  @Column({ name: THESIS_COLUMN.STUDENT_TOPIC_REGISTER, type: 'datetime2' })
  private readonly studentTopicRegister!: string;

  @Column({ name: THESIS_COLUMN.PROGRESS_REPORT, type: 'datetime2' })
  private readonly progressReport!: string;

  @Column({ name: THESIS_COLUMN.REVIEW, type: 'datetime2' })
  private readonly review!: string;

  @Column({ name: THESIS_COLUMN.DEFENSE, type: 'datetime2' })
  private readonly defense!: string;

  @Column({ name: THESIS_COLUMN.STATUS, type: 'int', default: THESIS_STATUS.ACTIVE })
  private readonly status!: number;

  @CreateDateColumn({ name: COMMON_COLUMN.CREATED_AT })
  private readonly createdAt!: string;

  @UpdateDateColumn({ name: COMMON_COLUMN.UPDATED_AT })
  private readonly updatedAt!: string;
}
