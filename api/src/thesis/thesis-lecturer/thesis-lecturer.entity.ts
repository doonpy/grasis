import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { COMMON_COLUMN, COMMON_ENTITY_OPTIONS } from '../../common/common.resource';
import { LecturerEntity } from '../../lecturer/lecturer.entity';
import { ThesisEntity } from '../thesis.entity';
import { THESIS_LECTURER_COLUMN, THESIS_LECTURER_TABLE } from './thesis-lecturer.resource';

@Entity({
  ...COMMON_ENTITY_OPTIONS,
  name: THESIS_LECTURER_TABLE
})
export class ThesisLecturerEntity {
  @PrimaryColumn({ name: THESIS_LECTURER_COLUMN.THESIS, type: 'int' })
  @ManyToOne(() => ThesisEntity, (thesis) => thesis.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: THESIS_LECTURER_COLUMN.THESIS, referencedColumnName: COMMON_COLUMN.ID })
  private readonly thesis!: number;

  @PrimaryColumn({ name: THESIS_LECTURER_COLUMN.LECTURER, type: 'int' })
  @ManyToOne(() => LecturerEntity, (lecturer) => lecturer.id, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION'
  })
  @JoinColumn({ name: THESIS_LECTURER_COLUMN.LECTURER, referencedColumnName: COMMON_COLUMN.ID })
  private readonly lecturer!: number;
}
