import { CommonColumns, CommonResponse } from '../common/common.type';
import { Lecturer, LecturerForFastView } from '../lecturer/lecturer.type';
import { ResultOfStudentForView } from '../result/result.type';
import { Thesis } from '../thesis/thesis.type';
import { TopicRegisterStatus } from './topic.resource';
import { TopicStateAction } from './topic-state/topic-state.resource';
import { TopicState } from './topic-state/topic-state.type';
import { TopicStudent } from './topic-student/topic-student.type';

export interface Topic extends CommonColumns {
  id: number;
  creatorId: number;
  subject: string;
  description: string | null;
  status: TopicStateAction;
  approverId: number;
  thesisId: number;
  maxStudent: number;
  currentStudent: number;
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

export interface TopicCreateResponse extends CommonResponse {
  id: number;
}

export interface TopicUpdateResponse extends CommonResponse {
  topic: TopicForView;
}

export interface TopicFindManyResponse extends CommonResponse {
  topics: Topic[];
  total: number;
}

export interface UseTopics {
  isLoading: boolean;
  data?: TopicFindManyResponse;
}

export type TopicGetByIdResponse = TopicUpdateResponse;

export interface UseTopic {
  isLoading: boolean;
  data?: TopicGetByIdResponse;
}

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
> & {
  creator: LecturerForFastView;
  approver: LecturerForFastView;
};

export interface TopicGetResultsForViewResponse extends CommonResponse {
  results: ResultOfStudentForView[];
}

export interface UseTopicResult {
  isLoading: boolean;
  data?: TopicGetResultsForViewResponse;
}
