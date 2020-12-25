import { CommonColumns, CommonResponse } from '../common/common.type';
import { LecturerForFastView } from '../lecturer/lecturer.type';
import { TopicStateBaseForView } from '../topic/topic-state/topic-state.type';
import { StateResult } from '../topic/topic.resource';
import { ReviewEntity } from './review.entity';

export type Review = ReviewEntity;

export type ReviewRequestBody = WithOptional<
  Omit<Review, keyof CommonColumns | 'result' | 'reviewer' | 'topic' | 'reviewerComment'>,
  'note' | 'place' | 'reviewerId'
>;

export interface ReviewUpdateResponse extends CommonResponse {
  review: ReviewForView;
}

export interface ReviewGetByIdResponse extends CommonResponse {
  review: ReviewForView | null;
}

export type ReviewForView = Omit<TopicStateBaseForView, 'topic'> &
  Pick<Review, 'reviewerId' | 'reviewerComment'> & {
    result: StateResult;
    reviewer: LecturerForFastView | null;
  };

export type ReviewChangeResultRequestBody = Pick<Review, 'reviewerComment' | 'result'>;
