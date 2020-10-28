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
import { Lecturer, LecturerFindByIdResponse } from './lecturer.interface';
import { LecturerPath } from './lecturer.resource';
import { LecturerService } from './lecturer.service';

@UseGuards(JwtAuthGuard)
@Controller(LecturerPath.ROOT)
export class LecturerController {
  constructor(private lecturerService: LecturerService) {}

  @Get(LecturerPath.SPECIFY)
  public async findById(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number
  ): Promise<LecturerFindByIdResponse> {
    const lecturer: Lecturer = await this.lecturerService.getById(id);

    return {
      statusCode: HttpStatus.OK,
      lecturer
    };
  }
}
