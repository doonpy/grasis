import { AxiosResponse } from 'axios';

import { NOT_SELECT_ID } from '../common/common.resource';
import CommonService from '../common/common.service';
import { ReviewApi } from './review.resource';
import { ReviewCreateOrUpdateResponse, ReviewRequestBody } from './review.type';

export default class ReviewAdminService extends CommonService {
  private static instance: ReviewAdminService;

  constructor() {
    super();
  }

  public static getInstance(): ReviewAdminService {
    if (!this.instance) {
      this.instance = new ReviewAdminService();
    }

    return this.instance;
  }

  public async updateById(
    id: number,
    body: ReviewRequestBody
  ): Promise<AxiosResponse<ReviewCreateOrUpdateResponse>> {
    if (body.reviewerId === NOT_SELECT_ID) {
      delete body.reviewerId;
    }

    await this.apiService.bindAuthorizationForClient();
    return this.apiService.patch<ReviewCreateOrUpdateResponse>(ReviewApi.ADMIN_SPECIFY, body, [id]);
  }
}
