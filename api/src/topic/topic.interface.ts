import { CommonColumns, CommonResponse } from '../common/common.interface';
import { TopicStateAction } from './topic-state/topic-state.resource';
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
    | 'thesisId'
  >,
  'description'
>;

export type RawTopicRequestBody = {
  [K in keyof TopicRequestBody]?: any;
};

export interface TopicCreateOrUpdateResponse extends CommonResponse {
  id: number;
}

export interface TopicGetManyResponse extends CommonResponse {
  topics: Topic[];
  total: number;
}

export interface TopicGetByIdResponse extends CommonResponse {
  topic: Topic;
}

export interface TopicChangeStatusRequestBody {
  note?: string;
  action: TopicStateAction;
}

export type RawTopicChangeStatusRequestBody = {
  [K in keyof TopicChangeStatusRequestBody]?: string;
};
