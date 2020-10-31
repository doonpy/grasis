import { Injectable, PipeTransform } from '@nestjs/common';

import { RawTopicRequestBody, TopicRequestBody } from '../topic.interface';

@Injectable()
export class ParseTopicRequestBodyPipe
  implements PipeTransform<RawTopicRequestBody, TopicRequestBody> {
  transform(value: RawTopicRequestBody): TopicRequestBody {
    const { creatorId, approverId } = value;
    const result: RawTopicRequestBody = {};
    if (creatorId) {
      result.creatorId = parseInt(creatorId);
    }

    if (approverId) {
      result.approverId = parseInt(approverId);
    }

    return <TopicRequestBody>{ ...value, ...result };
  }
}
