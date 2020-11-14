import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommonBody, CommonParam, CommonQueryValue } from '../common/common.resource';
import { commonIdValidateSchema } from '../common/common.validation';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { PermissionGuard } from '../topic/guards/permission.guard';
import { StateResult } from '../topic/topic.resource';
import { stateResultValidationSchema } from '../topic/topic.validation';
import { ReviewPath } from './review.resource';
import { ReviewService } from './review.service';
import { ReviewGetByIdResponse } from './review.type';

@UseGuards(JwtAuthGuard)
@Controller(ReviewPath.ROOT)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post(ReviewPath.CHANGE_RESULT)
  public async changeResult(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number,
    @Body(CommonBody.STATE_RESULT, new JoiValidationPipe(stateResultValidationSchema))
    result: StateResult,
    @Req() request: Express.CustomRequest
  ): Promise<void> {
    await this.reviewService.changeResult(id, request.user!.userId, result);
  }

  @Get(ReviewPath.SPECIFY)
  @UseGuards(PermissionGuard)
  public async getByTopicId(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    topicId: number
  ): Promise<ReviewGetByIdResponse> {
    const review = await this.reviewService.getByIdForView(topicId);

    return {
      statusCode: HttpStatus.OK,
      review
    };
  }
}
