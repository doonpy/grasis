import useSWR from 'swr';

import CommonService from '../common/common.service';
import { StateResult } from '../topic/topic-state/topic-state.resource';
import { ReviewApi } from './review.resource';
import { ReviewGetByIdResponse, UseReview } from './review.type';

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

  public async changeResult(id: number, result: StateResult): Promise<void> {
    await this.apiService.bindAuthorizationForClient();
    await this.apiService.post(this.replaceParams(ReviewApi.CHANGE_RESULT, [id]), {
      result
    });
  }
}
