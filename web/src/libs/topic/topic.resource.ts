import { THESIS_PATH_ROOT } from '../thesis/thesis.resource';

export enum TopicRegisterStatus {
  DISABLE = 1,
  ENABLE
}

export const TOPIC_API_ROOT = 'topics';

export const TopicApi = {
  GET_MANY: `${TOPIC_API_ROOT}?thesisId=@0&offset=@1&keyword=@2`,
  SPECIFY: `${TOPIC_API_ROOT}/@0`,
  CHANGE_STATUS: `${TOPIC_API_ROOT}/@0/change-status?thesisId=@1`,
  CHANGE_REGISTER_STATUS: `${TOPIC_API_ROOT}/@0/change-register-status`,
  REGISTER_TOPIC: `${TOPIC_API_ROOT}/@0/students/@1/register-topic`,
  CHANGE_STUDENT_REGISTER_STATUS: `${TOPIC_API_ROOT}/@0/students/@1/change-register-topic-status`,
  GET_REVIEW: `${TOPIC_API_ROOT}/@0/review`,
  GET_STUDENTS: `${TOPIC_API_ROOT}/@0/students?offset=@1`,
  GET_STATES: `${TOPIC_API_ROOT}/@0/states`,
  GET_RESULTS: `${TOPIC_API_ROOT}/@0/results`
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
  REVIEW: '5',
  DEFENSE: '6',
  RESULT: '7'
};
