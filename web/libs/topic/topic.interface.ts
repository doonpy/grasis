import { CommonResponse } from '../../../api/src/common/common.interface';
import { CommonColumns } from '../common/common.interface';
import { Lecturer } from '../lecturer/lecturer.interface';
import { Thesis } from '../thesis/thesis.interface';
import { TopicState } from './topic-state/topic-state.interface';
import { TopicStateAction } from './topic-state/topic-state.resource';
import { TopicStudent } from './topic-student/topic-student.interface';
import { TopicRegisterStatus } from './topic.resource';

export interface Topic extends CommonColumns {
  id: number;
  creatorId: number;
  subject: string;
  description: string | null;
  status: TopicStateAction;
  approverId: number;
  thesisId: number;
  maxStudent: number;
  registerStatus: TopicRegisterStatus;
  creator: Lecturer;
  approver: Lecturer;
  thesis: Thesis;
  states: TopicState[];
  students: TopicStudent[];
}

export interface TopicCreateOrUpdateResponse extends CommonResponse {
  id: number;
}

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

export interface TopicCreateOrUpdateResponse extends CommonResponse {
  id: number;
}

export interface TopicFindManyResponse extends CommonResponse {
  topics: Topic[];
  total: number;
}

export interface UseTopics {
  isLoading: boolean;
  data: TopicFindManyResponse;
}

export interface TopicGetByIdResponse extends CommonResponse {
  topic: Topic;
}

export interface UseTopic {
  isLoading: boolean;
  data: TopicGetByIdResponse;
}
