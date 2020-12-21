import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommonParam, CommonQueryValue } from '../common/common.resource';
import { commonIdValidateSchema } from '../common/common.validation';
import { AdminGuard } from '../common/guards/admin.guard';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { ParseThesisRequestBodyPipe } from './pipes/parse-thesis-request-body.pipe';
import { THESIS_ADMIN_ROOT_PATH, ThesisPath } from './thesis.resource';
import { ThesisService } from './thesis.service';
import {
  Thesis,
  ThesisCreateOrUpdateResponse,
  ThesisGetByIdForEditResponse,
  ThesisRequestBody,
  ThesisSwitchStatusResponse
} from './thesis.type';
import { thesisCreateValidationSchema, thesisUpdateValidationSchema } from './thesis.validation';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller(THESIS_ADMIN_ROOT_PATH)
export class ThesisAdminController {
  constructor(private readonly thesisService: ThesisService) {}

  @Post()
  public async create(
    @Body(new JoiValidationPipe(thesisCreateValidationSchema), ParseThesisRequestBodyPipe)
    body: ThesisRequestBody,
    @Request() req: Record<string, any>
  ): Promise<ThesisCreateOrUpdateResponse> {
    body.creatorId = req.user.userId;
    const createdThesis: Thesis = await this.thesisService.create(body);

    return {
      statusCode: HttpStatus.CREATED,
      id: createdThesis.id as number
    };
  }

  @Get(ThesisPath.ADMIN_EDIT)
  public async getByIdForEdit(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number
  ): Promise<ThesisGetByIdForEditResponse> {
    const thesis = await this.thesisService.getByIdForEdit(id);

    return {
      statusCode: HttpStatus.OK,
      thesis
    };
  }

  @Patch(ThesisPath.SPECIFY)
  public async updateById(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number,
    @Body(new JoiValidationPipe(thesisUpdateValidationSchema), ParseThesisRequestBodyPipe)
    body: ThesisRequestBody
  ): Promise<ThesisCreateOrUpdateResponse> {
    await this.thesisService.updateById(id, body);

    return {
      statusCode: HttpStatus.OK,
      id
    };
  }

  @Delete(ThesisPath.SPECIFY)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteById(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number
  ): Promise<ThesisCreateOrUpdateResponse> {
    await this.thesisService.deleteById(id);

    return {
      statusCode: HttpStatus.NO_CONTENT,
      id
    };
  }

  @Post(ThesisPath.ADMIN_SWITCH_STATUS)
  public async switchStatus(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number
  ): Promise<ThesisSwitchStatusResponse> {
    const thesis = await this.thesisService.switchStatus(id);

    return {
      statusCode: HttpStatus.OK,
      thesis
    };
  }
}
