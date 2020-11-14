import { StudentForFastView } from '../../student/student.type';
import { TopicStateBaseEntity } from '../entities/topic-state-base.entity';
import { TopicStateEntity } from './topic-state.entity';

export type TopicState = TopicStateEntity;

export interface TopicStateBaseForView extends Omit<TopicStateBaseEntity, 'deletedAt'> {
  reporters: StudentForFastView[];
}
