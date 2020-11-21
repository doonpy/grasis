import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  UseGuards
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommonParam, CommonQueryValue } from '../common/common.resource';
import { commonIdValidateSchema } from '../common/common.validation';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { TopicPermissionGuard } from '../topic/guards/topic-permission.guard';
import { DefensePath } from './defense.resource';
import { DefenseService } from './defense.service';
import { DefenseGetByIdResponse } from './defense.type';

@UseGuards(JwtAuthGuard, TopicPermissionGuard)
@Controller(DefensePath.ROOT)
export class DefenseController {
  constructor(private readonly defenseService: DefenseService) {}

  @Get(DefensePath.SPECIFY)
  public async getByTopicId(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    topicId: number
  ): Promise<DefenseGetByIdResponse> {
    const review = await this.defenseService.getByIdForView(topicId);

    return {
      statusCode: HttpStatus.OK,
      council: review
    };
  }
}
