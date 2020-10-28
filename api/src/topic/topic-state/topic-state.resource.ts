import { TOPIC_TABLE } from '../topic.resource';

export const TOPIC_STATE_TABLE = `${TOPIC_TABLE}_state`;

export const TopicStateColumn = {
  TOPIC_ID: 'topic_id',
  PROCESSOR: 'processor',
  COMMENT: 'comment',
  ACTION: 'action'
};

export enum TopicStateAction {
  NEW = 1,
  APPROVE,
  REJECT,
  SEND_BACK,
  WITHDRAW,
  CONFIRMED
}

export const NEW_STATE_COMMENT = 'Khởi tạo đề tài.';
