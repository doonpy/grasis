import { Body, Controller, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { ParseThesisRequestBodyPipe } from './pipes/parse-thesis-request-body.pipe';
import { Thesis, ThesisCreateOrUpdateResponse, ThesisRequestBody } from './thesis.interface';
import { ThesisPath } from './thesis.resource';
import { ThesisService } from './thesis.service';
import { thesisCreateValidationSchema } from './thesis.validation';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller(ThesisPath.ADMIN_ROOT)
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
}
