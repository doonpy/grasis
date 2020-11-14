import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CommonEntity } from '../common/common.entity';
import {
  COMMON_ENTITY_OPTIONS,
  CommonColumn,
  commonStringColumnOptions,
  ReportModule
} from '../common/common.resource';
import { TopicEntity } from '../topic/entities/topic.entity';
import { Topic } from '../topic/topic.type';
import { UserEntity } from '../user/user.entity';
import { User } from '../user/user.type';
import { COMMENT_TABLE, CommentColumn, CommentMode } from './comment.resource';

@Entity({ ...COMMON_ENTITY_OPTIONS, name: COMMENT_TABLE })
export class CommentEntity extends CommonEntity {
  @PrimaryGeneratedColumn({ name: CommonColumn.ID, type: 'int' })
  public id!: number;

  @Column({
    name: CommentColumn.CREATOR_ID,
    type: 'int'
  })
  public creatorId!: number;

  @Column({
    name: CommentColumn.TOPIC_ID,
    type: 'int'
  })
  public topicId!: number;

  @Column({
    ...commonStringColumnOptions,
    name: CommentColumn.CONTENT,
    type: 'text'
  })
  public content!: string;

  @Column({
    name: CommentColumn.MODE,
    type: 'tinyint',
    default: CommentMode.PUBLIC
  })
  public mode!: CommentMode;

  @Column({
    name: CommentColumn.MODULE,
    type: 'tinyint'
  })
  public module!: ReportModule;

  @ManyToOne(() => TopicEntity, (topic) => topic)
  @JoinColumn({ name: CommentColumn.TOPIC_ID, referencedColumnName: CommonColumn.ID })
  public topic!: Topic;

  @ManyToOne(() => UserEntity, (user) => user)
  @JoinColumn({
    name: CommentColumn.CREATOR_ID,
    referencedColumnName: CommonColumn.ID
  })
  public creator!: User;
}
