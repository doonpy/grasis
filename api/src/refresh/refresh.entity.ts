import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { COMMON_ENTITY_OPTIONS } from '../common/common.resource';
import { UserEntity } from '../user/user.entity';
import { REFRESH_ENTITY_RESOURCE } from './refresh.resource';

@Entity({ ...COMMON_ENTITY_OPTIONS, name: REFRESH_ENTITY_RESOURCE.TABLE_NAME })
export class RefreshEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Column({ type: 'int' })
  @ManyToOne(() => UserEntity, (user) => user.id, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  userId!: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  browser!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  version!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  platform!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  os!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  refreshToken!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  source!: string;

  @UpdateDateColumn()
  updatedAt!: Date;
}
