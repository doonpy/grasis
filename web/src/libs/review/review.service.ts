import { AxiosResponse } from 'axios';
import useSWR from 'swr';

import { NOT_SELECT_ID } from '../common/common.resource';
import CommonService from '../common/common.service';
import { StateResult } from '../topic/topic-state/topic-state.resource';
import { ReviewApi } from './review.resource';
import {
  ReviewChangeResultResponse,
  ReviewGetByIdResponse,
  ReviewGetResultResponse,
  ReviewRequestBody,
  ReviewUpdateResponse,
  UseReview,
  UseReviewResult
} from './review.type';

export default class ReviewService extends CommonService {
  private static instance: ReviewService;

  constructor() {
    super();
  }

  public static getInstance(): ReviewService {
    if (!this.instance) {
      this.instance = new ReviewService();
    }

    return this.instance;
  }

  public useReview(topicId: number, canFetch = true): UseReview {
    const { data } = useSWR<ReviewGetByIdResponse>(
      canFetch ? this.replaceParams(ReviewApi.SPECIFY, [topicId]) : null
    );

    return { data, isLoading: !data };
  }

  public async changeResult(
    id: number,
    result: StateResult,
    reviewerComment: string
  ): Promise<AxiosResponse<ReviewChangeResultResponse>> {
    await this.apiService.bindAuthorizationForClient();

    return this.apiService.post(this.replaceParams(ReviewApi.CHANGE_RESULT, [id]), {
      result,
      reviewerComment
    });
  }

  public async updateById(
    id: number,
    body: ReviewRequestBody
  ): Promise<AxiosResponse<ReviewUpdateResponse>> {
    if (body.reviewerId === NOT_SELECT_ID) {
      delete body.reviewerId;
    }

    await this.apiService.bindAuthorizationForClient();

    return this.apiService.patch<ReviewUpdateResponse>(ReviewApi.SPECIFY, body, [id]);
  }

  public useReviewResult(id: number, canFetch = true): UseReviewResult {
    const { data } = useSWR<ReviewGetResultResponse>(
      canFetch ? this.replaceParams(ReviewApi.GET_RESULT, [id]) : null
    );

    return { data, isLoading: !data };
  }
}
