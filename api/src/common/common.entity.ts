import { DeleteDateColumn } from 'typeorm';

export abstract class CommonEntity {
  @DeleteDateColumn()
  deletedAt!: Date;
}
