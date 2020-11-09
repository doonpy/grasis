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
import { CommonParam, CommonQuery, CommonQueryValue } from '../common/common.resource';
import {
  commonIdValidateSchema,
  commonLimitValidateSchema,
  commonOffsetValidateSchema
} from '../common/common.validation';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { ThesisState } from '../thesis/thesis.resource';
import {
  CommentCreateResponse,
  CommentGetManyResponse,
  CommentRequestBody
} from './comment.interface';
import { CommentPath, CommentQuery } from './comment.resource';
import { CommentService } from './comment.service';
import {
  commentValidateSchema,
  stateValidateSchema,
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
      CommentQuery.STATE,
      new JoiValidationPipe(stateValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    state: ThesisState,
    @Req() req: Express.CustomRequest
  ): Promise<CommentGetManyResponse> {
    const loginUserId = req.user!.userId;
    const comments = await this.commentService.getManyForView(
      topicId,
      loginUserId,
      state,
      offset,
      limit
    );
    const total = await this.commentService.getAmount(topicId, loginUserId, state);

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
