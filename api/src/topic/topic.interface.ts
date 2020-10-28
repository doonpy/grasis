import { CommonColumns, CommonResponse } from '../common/common.interface';
import { TopicEntity } from './topic.entity';

export type Topic = TopicEntity;

export type TopicRequestBody = WithOptional<
  Omit<
    Topic,
    | keyof CommonColumns
    | 'id'
    | 'creator'
    | 'thesis'
    | 'approver'
    | 'currentState'
    | 'currentStateId'
    | 'status'
  >,
  'description'
>;

export type RawTopicRequestBody = {
  [K in keyof TopicRequestBody]?: any;
};

export interface TopicCreateOrUpdateResponse extends CommonResponse {
  id: number;
}
