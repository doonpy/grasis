import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { CommonParam } from '../../common/common.resource';
import { ReviewService } from '../review.service';

@Injectable()
export class ReviewerGuard implements CanActivate {
  constructor(private readonly reviewService: ReviewService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Express.CustomRequest>();
    const loginUserId = request.user!.userId;
    const reviewId = request.params![CommonParam.ID];
    await this.reviewService.checkReviewerPermission(reviewId, loginUserId);

    return true;
  }
}
