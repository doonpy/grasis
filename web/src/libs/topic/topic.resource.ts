import { THESIS_PATH_ROOT } from '../thesis/thesis.resource';

export enum TopicRegisterStatus {
  DISABLE = 1,
  ENABLE
}

export const TOPIC_API_ROOT = 'topics';

export const TopicApi = {
  GET_MANY: `${TOPIC_API_ROOT}?thesisId=@0&offset=@1&keyword=@2`,
  SPECIFY: `${TOPIC_API_ROOT}/@0?thesisId=@1`,
  CHANGE_STATUS: `${TOPIC_API_ROOT}/@0/change-status?thesisId=@1`,
  CHANGE_REGISTER_STATUS: `${TOPIC_API_ROOT}/@0/change-register-status?thesisId=@1`,
  REGISTER_TOPIC: `${TOPIC_API_ROOT}/@0/register-topic?thesisId=@1&studentId=@2`,
  CHANGE_STUDENT_REGISTER_STATUS: `${TOPIC_API_ROOT}/@0/change-register-topic-status?thesisId=@1&studentId=@2`,
  GET_REVIEW: `${TOPIC_API_ROOT}/@0/review`
};

export const TOPIC_PATH_ROOT = `${THESIS_PATH_ROOT}/@0/topic`;

export const TopicPath = {
  SPECIFY: `${TOPIC_PATH_ROOT}/@1`,
  CREATE: `${TOPIC_PATH_ROOT}/create`,
  EDIT: `${TOPIC_PATH_ROOT}/@1/edit`
};

export const TopicTabKey = {
  INFO: '1',
  STUDENT_INFO: '2',
  PRIVATE_CONTENT: '3',
  PROGRESS_REPORT: '4',
  REVIEW: '5'
};
