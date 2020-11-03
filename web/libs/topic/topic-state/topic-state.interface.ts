import { CommonColumns } from '../../common/common.interface';
import { Lecturer } from '../../lecturer/lecturer.interface';
import { Topic } from '../topic.interface';
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
