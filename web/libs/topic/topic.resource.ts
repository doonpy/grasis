import { THESIS_PATH_ROOT } from '../thesis/thesis.resource';

export enum TopicStatus {
  NEW = 1,
  PENDING,
  APPROVED,
  REJECTED,
  CANCELED
}

export enum RegisterStatus {
  DISABLE = 1,
  ENABLE
}

export const TOPIC_API_ROOT = '/topics';

export const TopicApi = {};

export const TOPIC_PATH_ROOT = `${THESIS_PATH_ROOT}/@0/topic`;

export const TopicPath = {
  SPECIFY: `${TOPIC_PATH_ROOT}/@1`
};
