import { Body, Controller, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { ParseTopicRequestBodyPipe } from './pipes/parse-topic-request-body.pipe';
import { Topic, TopicCreateOrUpdateResponse, TopicRequestBody } from './topic.interface';
import { TopicPath } from './topic.resource';
import { TopicService } from './topic.service';
import { topicCreateValidationSchema } from './topic.validation';

@UseGuards(JwtAuthGuard)
@Controller(TopicPath.ROOT)
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post()
  public async create(
    @Body(new JoiValidationPipe(topicCreateValidationSchema), ParseTopicRequestBodyPipe)
    body: TopicRequestBody,
    @Request() req: Express.Request
  ): Promise<TopicCreateOrUpdateResponse> {
    body.creatorId = req.user?.userId as number;
    const createdTopic: Topic = await this.topicService.create(body);

    return {
      statusCode: HttpStatus.OK,
      id: createdTopic.id
    };
  }
}
