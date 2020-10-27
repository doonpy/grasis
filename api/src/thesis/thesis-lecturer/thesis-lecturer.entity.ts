import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { CommonEntity } from '../../common/common.entity';
import { COMMON_ENTITY_OPTIONS, CommonColumn } from '../../common/common.resource';
import { LecturerEntity } from '../../lecturer/lecturer.entity';
import { Lecturer } from '../../lecturer/lecturer.interface';
import { ThesisEntity } from '../thesis.entity';
import { Thesis } from '../thesis.interface';
import { THESIS_LECTURER_TABLE, ThesisLecturerColumn } from '../thesis.resource';

@Entity({ ...COMMON_ENTITY_OPTIONS, name: THESIS_LECTURER_TABLE })
export class ThesisLecturerEntity extends CommonEntity {
  @PrimaryColumn({ name: ThesisLecturerColumn.THESIS_ID, type: 'int' })
  public thesisId!: number;

  @PrimaryColumn({ name: ThesisLecturerColumn.LECTURER_ID, type: 'int' })
  public lecturerId!: number;

  @ManyToOne(() => ThesisEntity, ({ lecturers }) => lecturers)
  @JoinColumn({ name: ThesisLecturerColumn.THESIS_ID, referencedColumnName: CommonColumn.ID })
  public thesis!: Thesis;

  @ManyToOne(() => LecturerEntity, ({ theses }) => theses)
  @JoinColumn({ name: ThesisLecturerColumn.LECTURER_ID, referencedColumnName: CommonColumn.ID })
  public lecturer!: Lecturer;
}
