import { CommonColumns, CommonResponse } from '../common/common.type';
import { Lecturer, LecturerForFastView } from '../lecturer/lecturer.type';
import { StateResult } from '../topic/topic-state/topic-state.resource';
import { TopicStateBase, TopicStateBaseForView } from '../topic/topic-state/topic-state.type';

export interface Review extends TopicStateBase {
  reviewerId: number | null;
  reviewer: Lecturer | null;
  result: StateResult;
  reviewerComment: string | null;
}

export type ReviewRequestBody = WithOptional<
  Omit<Review, keyof CommonColumns | 'result' | 'reviewer' | 'topic' | 'reviewerComment'>,
  'note' | 'place' | 'reviewerId'
>;

export interface ReviewGetByIdResponse extends CommonResponse {
  review: ReviewForView;
}

export type ReviewForView = Omit<TopicStateBaseForView, 'deletedAt'> &
  Pick<Review, 'reviewerId' | 'reviewerComment'> & {
    result: StateResult;
    reviewer: LecturerForFastView | null;
  };

export interface UseReview {
  isLoading: boolean;
  data?: ReviewGetByIdResponse;
}

export type ReviewUpdateResponse = ReviewGetByIdResponse;

export type ReviewChangeResultResponse = ReviewGetByIdResponse;

export type ReviewGetResultResponse = CommonResponse & Pick<Review, 'result'>;

export interface UseReviewResult {
  isLoading: boolean;
  data?: ReviewGetResultResponse;
}
