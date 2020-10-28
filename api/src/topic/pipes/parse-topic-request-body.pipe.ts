import { Injectable, PipeTransform } from '@nestjs/common';

import { RawTopicRequestBody, TopicRequestBody } from '../topic.interface';

@Injectable()
export class ParseTopicRequestBodyPipe
  implements PipeTransform<RawTopicRequestBody, TopicRequestBody> {
  transform(value: RawTopicRequestBody): TopicRequestBody {
    const { creatorId, thesisId, approverId } = value;
    const result: RawTopicRequestBody = {};
    if (creatorId) {
      result.creatorId = parseInt(creatorId);
    }

    if (thesisId) {
      result.thesisId = parseInt(thesisId);
    }

    if (approverId) {
      result.approverId = parseInt(approverId);
    }

    return <TopicRequestBody>{ ...value, ...result };
  }
}
