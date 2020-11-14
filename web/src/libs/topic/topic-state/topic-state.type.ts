import { Moment } from 'moment';

import { CommonColumns } from '../../common/common.type';
import { Lecturer } from '../../lecturer/lecturer.type';
import { StudentForFastView } from '../../student/student.type';
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

export interface TopicStateBase extends CommonColumns {
  id: number;
  time: string | Moment;
  place: string | null;
  note: string | null;
}

export interface TopicStateBaseForView extends Omit<TopicStateBase, 'deletedAt'> {
  reporters: StudentForFastView[];
}
