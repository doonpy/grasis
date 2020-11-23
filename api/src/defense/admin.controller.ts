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
import { DefensePath } from './defense.resource';
import { DefenseService } from './defense.service';
import { DefenseCreateOrUpdateResponse, DefenseRequestBody } from './defense.type';
import { defenseCreateValidationSchema } from './defense.validation';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller(DefensePath.ADMIN_ROOT)
export class DefenseAdminController {
  constructor(private readonly defenseService: DefenseService) {}

  @Patch(DefensePath.SPECIFY)
  public async updateById(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number,
    @Body(new JoiValidationPipe(defenseCreateValidationSchema))
    body: DefenseRequestBody,
    @Req() request: Express.CustomRequest
  ): Promise<DefenseCreateOrUpdateResponse> {
    await this.defenseService.updateById(id, body, request.user!.userId);

    return {
      statusCode: HttpStatus.OK,
      id
    };
  }
}
