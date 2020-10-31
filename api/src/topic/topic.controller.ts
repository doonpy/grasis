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
  Query,
  Request,
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
import { ThesisPermissionGuard } from '../thesis/guards/thesis-permission.guard';
import { UserService } from '../user/user.service';
import { TopicLecturerRegisterGuard } from './guards/topic-lecturer-register.guard';
import { TopicPermissionGuard } from './guards/topic-permission.guard';
import { ParseTopicChangeStatusPipe } from './pipes/parse-topic-change-status.pipe';
import { ParseTopicRequestBodyPipe } from './pipes/parse-topic-request-body.pipe';
import {
  Topic,
  TopicChangeStatusRequestBody,
  TopicCreateOrUpdateResponse,
  TopicGetByIdResponse,
  TopicGetManyResponse,
  TopicRequestBody
} from './topic.interface';
import { TopicParam, TopicPath } from './topic.resource';
import { TopicService } from './topic.service';
import {
  topicChangeActionValidationSchema,
  topicCreateValidationSchema,
  topicUpdateValidationSchema
} from './topic.validation';

@UseGuards(JwtAuthGuard, ThesisPermissionGuard)
@Controller(TopicPath.ROOT)
export class TopicController {
  constructor(
    private readonly topicService: TopicService,
    private readonly userService: UserService
  ) {}

  @Post()
  @UseGuards(TopicLecturerRegisterGuard)
  public async create(
    @Param(
      TopicParam.THESIS_ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    thesisId: number,
    @Body(new JoiValidationPipe(topicCreateValidationSchema), ParseTopicRequestBodyPipe)
    body: TopicRequestBody,
    @Request() req: Express.Request
  ): Promise<TopicCreateOrUpdateResponse> {
    body.creatorId = req.user?.userId as number;
    const createdTopic: Topic = await this.topicService.create(thesisId, body);

    return {
      statusCode: HttpStatus.OK,
      id: createdTopic.id
    };
  }

  @Get()
  public async getMany(
    @Param(
      TopicParam.THESIS_ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    thesisId: number,
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
    @Request() req: Express.Request,
    @Query(CommonQuery.KEYWORD, new DefaultValuePipe(undefined)) keyword: string
  ): Promise<TopicGetManyResponse> {
    const loginUserId = req.user?.userId as number;
    const topics = await this.topicService.getMany(thesisId, offset, limit, loginUserId, keyword);
    const total: number = await this.topicService.getAmount(thesisId, loginUserId, keyword);

    return {
      statusCode: HttpStatus.OK,
      topics,
      total
    };
  }

  @Get(TopicPath.SPECIFY)
  @UseGuards(TopicPermissionGuard)
  public async getById(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number,
    @Request() req: Express.Request
  ): Promise<TopicGetByIdResponse> {
    const loginUserId = req.user?.userId as number;
    const loginUser = await this.userService.findById(loginUserId);
    const topic = await this.topicService.getById(id, loginUser);

    return {
      statusCode: HttpStatus.OK,
      topic
    };
  }

  @Patch(TopicPath.SPECIFY)
  @UseGuards(TopicPermissionGuard, TopicLecturerRegisterGuard)
  public async updateById(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number,
    @Body(new JoiValidationPipe(topicUpdateValidationSchema), ParseTopicRequestBodyPipe)
    body: TopicRequestBody,
    @Request() req: Express.Request
  ): Promise<TopicCreateOrUpdateResponse> {
    const loginUserId = req.user?.userId as number;
    const loginUser = await this.userService.findById(loginUserId);
    await this.topicService.updateById(id, loginUser, body);

    return {
      statusCode: HttpStatus.OK,
      id
    };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(TopicPath.SPECIFY)
  @UseGuards(TopicPermissionGuard, TopicLecturerRegisterGuard)
  public async deleteById(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number,
    @Request() req: Express.Request
  ): Promise<void> {
    const loginUserId = req.user?.userId as number;
    const loginUser = await this.userService.findById(loginUserId);
    await this.topicService.deleteById(id, loginUser);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(TopicPath.CHANGE_STATUS)
  @UseGuards(TopicPermissionGuard, TopicLecturerRegisterGuard)
  public async changeStatus(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number,
    @Body(new JoiValidationPipe(topicChangeActionValidationSchema), ParseTopicChangeStatusPipe)
    body: TopicChangeStatusRequestBody,
    @Request() req: Express.Request
  ): Promise<void> {
    const loginUserId = req.user?.userId as number;
    const loginUser = await this.userService.findById(loginUserId);
    await this.topicService.changeStatus(id, loginUser, body);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(TopicPath.CHANGE_REGISTER_STATUS)
  @UseGuards(TopicPermissionGuard, TopicLecturerRegisterGuard)
  public async changeRegisterStatus(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number,
    @Request() req: Express.Request
  ): Promise<void> {
    const loginUserId = req.user?.userId as number;
    const loginUser = await this.userService.findById(loginUserId);
    await this.topicService.changeRegisterStatus(id, loginUser);
  }
}
