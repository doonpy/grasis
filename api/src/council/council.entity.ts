import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CommonEntity } from '../common/common.entity';
import {
  COMMON_ENTITY_OPTIONS,
  CommonColumn,
  commonStringColumnOptions
} from '../common/common.resource';
import { LecturerEntity } from '../lecturer/lecturer.entity';
import { Lecturer } from '../lecturer/lecturer.type';
import { ThesisEntity } from '../thesis/thesis.entity';
import { Thesis } from '../thesis/thesis.type';
import { COUNCIL_TABLE, CouncilColumn } from './council.resource';

@Entity({ ...COMMON_ENTITY_OPTIONS, name: COUNCIL_TABLE })
export class CouncilEntity extends CommonEntity {
  @PrimaryGeneratedColumn({
    name: CommonColumn.ID,
    type: 'int'
  })
  public id!: number;

  @Column({
    name: CouncilColumn.NAME,
    type: 'nvarchar',
    length: 100,
    ...commonStringColumnOptions
  })
  public name!: string;

  @Column({
    name: CouncilColumn.THESIS_ID,
    type: 'int'
  })
  public thesisId!: number;

  @Column({
    name: CouncilColumn.CHAIRMAN_ID,
    type: 'int'
  })
  public chairmanId!: number;

  @Column({
    name: CouncilColumn.INSTRUCTOR_ID,
    type: 'int'
  })
  public instructorId!: number;

  @Column({
    name: CouncilColumn.COMMISSIONER_ID,
    type: 'int'
  })
  public commissionerId!: number;

  @ManyToOne(() => ThesisEntity, (thesis) => thesis)
  @JoinColumn({ name: CouncilColumn.THESIS_ID, referencedColumnName: CommonColumn.ID })
  public thesis!: Thesis;

  @ManyToOne(() => LecturerEntity, (lecturer) => lecturer)
  @JoinColumn({ name: CouncilColumn.CHAIRMAN_ID, referencedColumnName: CommonColumn.ID })
  public chairman!: Lecturer;

  @ManyToOne(() => LecturerEntity, (lecturer) => lecturer)
  @JoinColumn({ name: CouncilColumn.INSTRUCTOR_ID, referencedColumnName: CommonColumn.ID })
  public instructor!: Lecturer;

  @ManyToOne(() => LecturerEntity, (lecturer) => lecturer)
  @JoinColumn({ name: CouncilColumn.COMMISSIONER_ID, referencedColumnName: CommonColumn.ID })
  public commissioner!: Lecturer;
}
