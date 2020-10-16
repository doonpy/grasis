import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { COMMON_PARAMS, COMMON_QUERIES_VALUE } from '../common/common.resource';
import { commonIdValidateSchema } from '../common/common.validation';
import { AdminGuard } from '../common/guard/admin.guard';
import { JoiValidationPipe } from '../common/pipe/joi-validation.pipe';
import { StudentCreateOrUpdateResponse, StudentRequestBody } from './student.interface';
import { STD_CONTROLLER_RESOURCE } from './student.resource';
import { StudentService } from './student.service';
import { studentCreateValidationSchema, studentUpdateValidationSchema } from './student.validation';

@UseGuards(JwtAuthGuard)
@Controller(STD_CONTROLLER_RESOURCE.PATH.ADMIN_ROOT)
export class StudentAdminController {
  constructor(private studentService: StudentService) {}

  @Post()
  @UseGuards(AdminGuard)
  @UsePipes(new JoiValidationPipe(studentCreateValidationSchema))
  public async create(
    @Body()
    body: StudentRequestBody
  ): Promise<StudentCreateOrUpdateResponse> {
    const createdStudent = await this.studentService.create(body);

    return {
      statusCode: HttpStatus.CREATED,
      id: createdStudent.id as number
    };
  }

  @Patch(STD_CONTROLLER_RESOURCE.PATH.SPECIFY)
  @UseGuards(AdminGuard)
  public async updateById(
    @Param(
      COMMON_PARAMS.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(COMMON_QUERIES_VALUE.FAILED_ID),
      ParseIntPipe
    )
    id: number,
    @Body(new JoiValidationPipe(studentUpdateValidationSchema))
    body: StudentRequestBody
  ): Promise<StudentCreateOrUpdateResponse> {
    await this.studentService.updateById(id, body);

    return {
      statusCode: HttpStatus.OK,
      id
    };
  }

  @Delete(STD_CONTROLLER_RESOURCE.PATH.SPECIFY)
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteById(
    @Param(
      COMMON_PARAMS.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(COMMON_QUERIES_VALUE.FAILED_ID),
      ParseIntPipe
    )
    id: number
  ): Promise<void> {
    await this.studentService.deleteById(id);
  }
}
