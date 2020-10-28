import { CommonResponse } from '../../../api/src/common/common.interface';
import { CommonColumns } from '../common/common.interface';
import { Lecturer } from '../lecturer/lecturer.interface';
import { Thesis } from '../thesis/thesis.interface';
import { RegisterStatus, TopicStatus } from './topic.resource';

export interface Topic extends CommonColumns {
  id: number;
  creatorId: number;
  subject: string;
  description: string | null;
  status: TopicStatus;
  approverId: number;
  thesisId: number;
  maxStudent: number;
  registerStatus: RegisterStatus;
  creator: Lecturer;
  approver: Lecturer;
  thesis: Thesis;
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
