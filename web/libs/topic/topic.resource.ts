import { THESIS_PATH_ROOT } from '../thesis/thesis.resource';

export enum TopicRegisterStatus {
  DISABLE = 1,
  ENABLE
}

export const TOPIC_API_ROOT = '/@0/topics';

export const TopicApi = {
  GET_MANY: `${TOPIC_API_ROOT}?offset=@1&keyword=@2`,
  SPECIFY: `${TOPIC_API_ROOT}/@1`,
  CHANGE_STATUS: `${TOPIC_API_ROOT}/@1/change-status`,
  CHANGE_REGISTER_STATUS: `${TOPIC_API_ROOT}/@1/change-register-status`,
  REGISTER_TOPIC: `${TOPIC_API_ROOT}/@1/register-topic/@2`,
  CHANGE_STUDENT_REGISTER_STATUS: `${TOPIC_API_ROOT}/@1/register-topic/@2/change`
};

export const TOPIC_PATH_ROOT = `${THESIS_PATH_ROOT}/@0/topic`;

export const TopicPath = {
  SPECIFY: `${TOPIC_PATH_ROOT}/@1`,
  CREATE: `${TOPIC_PATH_ROOT}/create`,
  EDIT: `${TOPIC_PATH_ROOT}/@1/edit`
};
