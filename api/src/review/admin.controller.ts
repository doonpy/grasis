import {
  Body,
  Controller,
  DefaultValuePipe,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UseGuards
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommonParam, CommonQueryValue } from '../common/common.resource';
import { commonIdValidateSchema } from '../common/common.validation';
import { AdminGuard } from '../common/guards/admin.guard';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { TopicService } from '../topic/topic.service';
import { UserService } from '../user/user.service';
import { ReviewPath } from './review.resource';
import { ReviewService } from './review.service';
import { ReviewCreateOrUpdateResponse, ReviewRequestBody } from './review.type';
import { reviewCreateValidationSchema } from './review.validation';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller(ReviewPath.ADMIN_ROOT)
export class ReviewAdminController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly topicService: TopicService,
    private readonly userService: UserService
  ) {}

  @Patch(ReviewPath.SPECIFY)
  public async updateById(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number,
    @Body(new JoiValidationPipe(reviewCreateValidationSchema))
    body: ReviewRequestBody,
    @Req() request: Express.CustomRequest
  ): Promise<ReviewCreateOrUpdateResponse> {
    const loginUser = await this.userService.findById(request.user!.userId);
    await this.topicService.checkPermission(id, loginUser);
    await this.reviewService.updateById(id, body);

    return {
      statusCode: HttpStatus.OK,
      id
    };
  }
}
