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
import { ResultService } from '../result/result.service';
import { ThesisPermissionGuard } from './guards/thesis-permission.guard';
import { TopicLecturerRegisterGuard } from './guards/topic-lecturer-register.guard';
import { TopicPermissionGuard } from './guards/topic-permission.guard';
import { TopicStudentRegisterGuard } from './guards/topic-student-register.guard';
import { ParseTopicChangeStatusPipe } from './pipes/parse-topic-change-status.pipe';
import { ParseTopicChangeStudentRegisterStatusPipe } from './pipes/parse-topic-change-student-register-status.pipe';
import { ParseTopicRequestBodyPipe } from './pipes/parse-topic-request-body.pipe';
import { TopicError, TopicPath, TopicQuery } from './topic.resource';
import { TopicService } from './topic.service';
import {
  Topic,
  TopicChangeStatusRequestBody,
  TopicChangeStudentRegisterStatusRequestBody,
  TopicCreateResponse,
  TopicGetByIdResponse,
  TopicGetManyResponse,
  TopicGetResultsForViewResponse,
  TopicRequestBody,
  TopicUpdateResponse
} from './topic.type';
import {
  topicChangeActionValidationSchema,
  topicChangeStudentRegisterStatusValidationSchema,
  topicCreateValidationSchema,
  topicUpdateValidationSchema
} from './topic.validation';
import { TopicStateService } from './topic-state/topic-state.service';
import { TopicChangeStateResponse, TopicGetStatesResponse } from './topic-state/topic-state.type';
import { TopicStudentService } from './topic-student/topic-student.service';
import {
  TopicGetStudentsResponse,
  TopicStudentChangeRegisterStatusResponse,
  TopicStudentForView,
  TopicStudentRegisterResponse
} from './topic-student/topic-student.type';

@UseGuards(JwtAuthGuard)
@Controller(TopicPath.ROOT)
export class TopicController {
  constructor(
    private readonly topicService: TopicService,
    private readonly topicStudentService: TopicStudentService,
    private readonly topicStateService: TopicStateService,
    private readonly resultService: ResultService
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
  ): Promise<TopicCreateResponse> {
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
    const topic = await this.topicService.getById(topicId, true);
    await this.topicService.checkPermission(topic, request.user!.userId);

    return {
      statusCode: HttpStatus.OK,
      topic: await this.topicService.convertForView(topic)
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
  ): Promise<TopicUpdateResponse> {
    const topic = await this.topicService.updateById(id, req.user!.userId, body);

    return {
      statusCode: HttpStatus.OK,
      topic: await this.topicService.convertForView(topic)
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

  @HttpCode(HttpStatus.OK)
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
  ): Promise<TopicChangeStateResponse> {
    const states = await this.topicService.changeStatus(id, req.user!.userId, body);

    return {
      statusCode: HttpStatus.OK,
      states: this.topicStateService.convertForView(states)
    };
  }

  @HttpCode(HttpStatus.OK)
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
  ): Promise<TopicUpdateResponse> {
    const topic = await this.topicService.changeRegisterStatus(id, req.user!.userId);

    return {
      statusCode: HttpStatus.OK,
      topic: await this.topicService.convertForView(topic)
    };
  }

  @HttpCode(HttpStatus.OK)
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
  ): Promise<TopicStudentRegisterResponse> {
    const student = await this.topicService.registerTopic(id, studentId);

    return {
      statusCode: HttpStatus.OK,
      student: this.topicStudentService.convertForView(student)
    };
  }

  @HttpCode(HttpStatus.OK)
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
  ): Promise<TopicStudentChangeRegisterStatusResponse> {
    const topicStudent = await this.topicService.changeStudentRegisterStatus(
      req.user!.userId,
      id,
      studentId,
      body.status
    );

    return {
      statusCode: HttpStatus.OK,
      student: topicStudent
    };
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
    ).map((student) => this.topicStudentService.convertForView(student));

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
    const topic = await this.topicService.getById(id, true);
    if (topic.creatorId !== loginUserId && topic.thesis!.creatorId !== loginUserId) {
      throw new BadRequestException(TopicError.ERR_14);
    }

    const states = await this.topicStateService.getMany(id);

    return {
      statusCode: HttpStatus.OK,
      states: this.topicStateService.convertForView(states)
    };
  }

  @Get(TopicPath.GET_RESULTS)
  @UseGuards(TopicPermissionGuard)
  public async getByResultForView(
    @Param(
      CommonParam.ID,
      new JoiValidationPipe(commonIdValidateSchema),
      new DefaultValuePipe(CommonQueryValue.FAILED_ID),
      ParseIntPipe
    )
    id: number,
    @Req()
    request: Express.CustomRequest
  ): Promise<TopicGetResultsForViewResponse> {
    const results = await this.resultService.getByTopicIdForView(id, request.user!.userId);

    return {
      statusCode: HttpStatus.OK,
      results
    };
  }
}
