import { TOPIC_TABLE } from '../topic.resource';

export const TOPIC_STUDENT_TABLE = `${TOPIC_TABLE}_student`;

export const TopicStudentColumn = {
  TOPIC_ID: 'topic_id',
  STUDENT_ID: 'student_id',
  STATUS: 'status'
};

export enum TopicStudentStatus {
  PENDING = 1,
  APPROVED,
  REJECTED
}

export const TopicStudentError = {
  ERR_1: 'Bạn không phải sinh viên thực hiện đề tài này.'
};
