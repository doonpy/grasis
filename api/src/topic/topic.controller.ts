import {
  BadRequestException,
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
  Req,
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
import { ThesisPermissionGuard } from './guards/thesis-permission.guard';
import { TopicLecturerRegisterGuard } from './guards/topic-lecturer-register.guard';
import { TopicPermissionGuard } from './guards/topic-permission.guard';
import { TopicStudentRegisterGuard } from './guards/topic-student-register.guard';
import { ParseTopicChangeStatusPipe } from './pipes/parse-topic-change-status.pipe';
import { ParseTopicChangeStudentRegisterStatusPipe } from './pipes/parse-topic-change-student-register-status.pipe';
import { ParseTopicRequestBodyPipe } from './pipes/parse-topic-request-body.pipe';
import { TopicStateService } from './topic-state/topic-state.service';
import { TopicGetStatesResponse } from './topic-state/topic-state.type';
import { TopicStudentService } from './topic-student/topic-student.service';
import { TopicGetStudentsResponse, TopicStudentForView } from './topic-student/topic-student.type';
import { TopicError, TopicPath, TopicQuery } from './topic.resource';
import { TopicService } from './topic.service';
import {
  Topic,
  TopicChangeStatusRequestBody,
  TopicChangeStudentRegisterStatusRequestBody,
  TopicCreateOrUpdateResponse,
  TopicGetByIdResponse,
  TopicGetManyResponse,
  TopicRequestBody
} from './topic.type';
import {
  topicChangeActionValidationSchema,
  topicChangeStudentRegisterStatusValidationSchema,
  topicCreateValidationSchema,
  topicUpdateValidationSchema
} from './topic.validation';

@UseGuards(JwtAuthGuard)
@Controller(TopicPath.ROOT)
export class TopicController {
  constructor(
    private readonly topicService: TopicService,
    private readonly topicStudentService: TopicStudentService,
    private readonly topicStateService: TopicStateService
  ) {}

  @Post()
  @UseGuards(ThesisPermissionGuard)
  public async create(
    @Query(
      TopicQuery.THESIS_ID,
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
  @UseGuards(ThesisPermissionGuard)
  public async getMany(
    @Query(
      TopicQuery.THESIS_ID,
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
  public async getByIdForView(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    topicId: number,
    @Req() request: Express.CustomRequest
  ): Promise<TopicGetByIdResponse> {
    const topic = await this.topicService.getByIdForView(topicId, request.user!.userId);

    return {
      statusCode: HttpStatus.OK,
      topic
    };
  }

  @Patch(TopicPath.SPECIFY)
  @UseGuards(TopicLecturerRegisterGuard)
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
    await this.topicService.updateById(id, req.user!.userId, body);

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
    await this.topicService.deleteById(id, req.user!.userId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(TopicPath.CHANGE_STATUS)
  @UseGuards(TopicLecturerRegisterGuard)
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
    await this.topicService.changeStatus(id, req.user!.userId, body);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(TopicPath.CHANGE_REGISTER_STATUS)
  @UseGuards(TopicStudentRegisterGuard)
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
    await this.topicService.changeRegisterStatus(id, req.user!.userId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(TopicPath.REGISTER_TOPIC)
  @UseGuards(TopicStudentRegisterGuard)
  public async registerTopic(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number,
    @Param(
      TopicQuery.STUDENT_ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    studentId: number
  ): Promise<void> {
    await this.topicService.registerTopic(id, studentId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(TopicPath.CHANGE_STUDENT_REGISTER_STATUS)
  @UseGuards(TopicStudentRegisterGuard)
  public async changStudentRegisterStatus(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number,
    @Param(
      TopicQuery.STUDENT_ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    studentId: number,
    @Body(
      new JoiValidationPipe(topicChangeStudentRegisterStatusValidationSchema),
      ParseTopicChangeStudentRegisterStatusPipe
    )
    body: TopicChangeStudentRegisterStatusRequestBody,
    @Request() req: Express.Request
  ): Promise<void> {
    await this.topicService.changeStudentRegisterStatus(
      req.user!.userId,
      id,
      studentId,
      body.status
    );
  }

  @Get(TopicPath.GET_STUDENTS)
  @UseGuards(TopicPermissionGuard)
  public async getStudentsByTopicId(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number,
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
    limit: number
  ): Promise<TopicGetStudentsResponse> {
    const students: TopicStudentForView[] = (
      await this.topicStudentService.getMany(id, limit, offset)
    ).map(
      ({
        topicId,
        status,
        updatedAt,
        student: {
          id,
          studentId,
          user: { firstname, lastname, deletedAt }
        }
      }) => ({
        id,
        topicId,
        studentId,
        firstname,
        lastname,
        status,
        deletedAt,
        updatedAt
      })
    );

    return {
      statusCode: HttpStatus.OK,
      students
    };
  }

  @Get(TopicPath.GET_STATES)
  @UseGuards(TopicPermissionGuard)
  public async getTopicStates(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number,
    @Req() request: Express.CustomRequest
  ): Promise<TopicGetStatesResponse> {
    const loginUserId = request.user!.userId;
    const topic = await this.topicService.getById(id);
    if (topic.creatorId !== loginUserId && topic.thesis.creatorId !== loginUserId) {
      throw new BadRequestException(TopicError.ERR_14);
    }

    const states = (await this.topicStateService.getMany(id)).map(({ processor, ...remain }) => ({
      ...remain,
      processor: processor.convertToFastView()
    }));

    return {
      statusCode: HttpStatus.OK,
      states
    };
  }
}
