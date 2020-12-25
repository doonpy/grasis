import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommonParam, CommonQueryValue } from '../common/common.resource';
import { commonIdValidateSchema } from '../common/common.validation';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { TopicPermissionGuard } from '../topic/guards/topic-permission.guard';
import { ReviewerGuard } from './guards/reviewer.guard';
import { ReviewPath } from './review.resource';
import { ReviewService } from './review.service';
import { ReviewChangeResultRequestBody, ReviewGetByIdResponse } from './review.type';
import { reviewChangeResultValidationSchema } from './review.validation';

@UseGuards(JwtAuthGuard, TopicPermissionGuard)
@Controller(ReviewPath.ROOT)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post(ReviewPath.CHANGE_RESULT)
  @UseGuards(ReviewerGuard)
  public async changeResult(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number,
    @Body(new JoiValidationPipe(reviewChangeResultValidationSchema))
    body: ReviewChangeResultRequestBody
  ): Promise<void> {
    await this.reviewService.changeResult(id, body);
  }

  @Get(ReviewPath.SPECIFY)
  public async getByTopicId(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    topicId: number
  ): Promise<ReviewGetByIdResponse> {
    const review = await this.reviewService.getById(topicId);

    return {
      statusCode: HttpStatus.OK,
      review: await this.reviewService.convertForView(review)
    };
  }
}
