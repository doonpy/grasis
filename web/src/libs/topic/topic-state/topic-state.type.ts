import { CommonColumns } from '../../common/common.type';
import { Lecturer } from '../../lecturer/lecturer.type';
import { Topic } from '../topic.type';
import { TopicStateAction } from './topic-state.resource';

export interface TopicState extends CommonColumns {
  id: number;
  topicId: number;
  processorId: number;
  note: string | null;
  action: TopicStateAction;
  topic: Topic;
  processor: Lecturer;
}
