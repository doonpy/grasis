import { CommonColumns } from '../../common/common.interface';
import { Topic } from '../topic.interface';

export interface TopicState extends CommonColumns {
  id: number;
  topicId: number;
  comment: string | null;
  action: TopicStateAction;
  topic: Topic;
}

export enum TopicStateAction {
  NEW = 1,
  APPROVE,
  REJECT,
  SEND_BACK,
  WITHDRAW,
  CONFIRMED
}
