import { TOPIC_TABLE } from '../topic.resource';

export const TOPIC_STATE_TABLE = `${TOPIC_TABLE}_state`;

export const TopicStateColumn = {
  TOPIC_ID: 'topic_id',
  PROCESSOR_ID: 'processor_id',
  NOTE: 'note',
  ACTION: 'action'
};

export enum TopicStateAction {
  NEW = 1,
  APPROVED,
  REJECTED,
  SEND_BACK,
  WITHDRAW,
  SEND_REQUEST,
  CANCELED
}

export const NEW_STATE_NOTE = '[Hệ thống] Khởi tạo đề tài.';
export const CANCELLED_STATE_NOTE = '[Hệ thống] Hủy bỏ đề tài do quá hạn.';
