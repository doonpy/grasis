import { CommonResponse } from '../../common/common.type';
import { LecturerForFastView } from '../../lecturer/lecturer.type';
import { StudentForFastView } from '../../student/student.type';
import { TopicStateBaseEntity } from '../entities/topic-state-base.entity';
import { TopicStateEntity } from './topic-state.entity';

export type TopicState = TopicStateEntity;

export interface TopicStateBaseForView extends Omit<TopicStateBaseEntity, 'deletedAt'> {
  reporters: StudentForFastView[];
}

export type TopicStateForView = Omit<TopicState, 'processor'> & {
  processor: LecturerForFastView;
};

export interface TopicGetStatesResponse extends CommonResponse {
  states: TopicStateForView[];
}

export type TopicChangeStateResponse = TopicGetStatesResponse;
