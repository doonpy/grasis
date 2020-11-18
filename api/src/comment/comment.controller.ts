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
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CommonParam,
  CommonQuery,
  CommonQueryValue,
  ReportModule
} from '../common/common.resource';
import {
  commonIdValidateSchema,
  commonLimitValidateSchema,
  commonOffsetValidateSchema
} from '../common/common.validation';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { CommentPath, CommentQuery } from './comment.resource';
import { CommentService } from './comment.service';
import { CommentCreateResponse, CommentGetManyResponse, CommentRequestBody } from './comment.type';
import {
  commentModuleValidateSchema,
  commentValidateSchema,
  topicValidateSchema
} from './comment.validation';

@UseGuards(JwtAuthGuard)
@Controller(CommentPath.ROOT)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async postComment(
    @Body(new JoiValidationPipe(commentValidateSchema))
    body: CommentRequestBody,
    @Req() req: Express.CustomRequest
  ): Promise<CommentCreateResponse> {
    const loginUserId = req.user!.userId;
    const { id } = await this.commentService.create(loginUserId, body);

    return {
      statusCode: HttpStatus.CREATED,
      id
    };
  }

  @Get()
  public async getCommentsForView(
    @Query(
      CommonQuery.OFFSET,
      new JoiValidationPipe(commonOffsetValidateSchema),
      new DefaultValuePipe(CommonQueryValue.OFFSET),
      ParseIntPipe
    )
    offset: number,
    @Query(
      CommonQuery.LIMIT,
      new JoiValidationPipe(commonLimitValidateSchema),
      new DefaultValuePipe(CommonQueryValue.LIMIT),
      ParseIntPipe
    )
    limit: number,
    @Query(
      CommentQuery.TOPIC_ID,
      new JoiValidationPipe(topicValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    topicId: number,
    @Query(
      CommentQuery.MODULE,
      new JoiValidationPipe(commentModuleValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    module: ReportModule,
    @Req() req: Express.CustomRequest
  ): Promise<CommentGetManyResponse> {
    const loginUserId = req.user!.userId;
    const comments = await this.commentService.getManyForView(
      topicId,
      loginUserId,
      module,
      offset,
      limit
    );
    const total = await this.commentService.getAmount(topicId, loginUserId, module);

    return {
      statusCode: HttpStatus.CREATED,
      comments,
      total
    };
  }

  @Delete(CommentPath.SPECIFY)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteCommentById(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    commentId: number,
    @Req() req: Express.CustomRequest
  ): Promise<void> {
    const loginUserId = req.user!.userId;
    await this.commentService.deleteById(commentId, loginUserId);
  }
}
