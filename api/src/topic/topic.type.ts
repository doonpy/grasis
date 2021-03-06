import { CommonColumns, CommonResponse } from '../common/common.type';
import { LecturerForFastView } from '../lecturer/lecturer.type';
import { ResultOfStudentForView } from '../result/result.type';
import { TopicEntity } from './entities/topic.entity';
import { TopicStateAction } from './topic-state/topic-state.resource';
import { TopicStudentStatus } from './topic-student/topic-student.resouce';

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
    | 'states'
    | 'students'
  >,
  'description'
>;

export type RawTopicRequestBody = {
  [K in keyof TopicRequestBody]?: any;
};

export interface TopicCreateResponse extends CommonResponse {
  id: number;
}

export interface TopicUpdateResponse extends CommonResponse {
  topic: TopicForView;
}

export interface TopicGetManyResponse extends CommonResponse {
  topics: Topic[];
  total: number;
}

export type TopicGetByIdResponse = TopicUpdateResponse;

export interface TopicChangeStatusRequestBody {
  note?: string;
  action: TopicStateAction;
}

export type RawTopicChangeStatusRequestBody = {
  [K in keyof TopicChangeStatusRequestBody]?: string;
};

export interface TopicChangeStudentRegisterStatusRequestBody {
  status: TopicStudentStatus;
}

export type RawTopicChangeStudentRegisterStatusRequestBody = {
  [K in keyof TopicChangeStudentRegisterStatusRequestBody]?: string;
};

export type TopicForView = Pick<
  Topic,
  | 'id'
  | 'subject'
  | 'description'
  | 'currentStudent'
  | 'registerStatus'
  | 'maxStudent'
  | 'status'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
> & {
  creator: LecturerForFastView;
  approver: LecturerForFastView;
};

export interface TopicGetResultsForViewResponse extends CommonResponse {
  results: ResultOfStudentForView[];
}
