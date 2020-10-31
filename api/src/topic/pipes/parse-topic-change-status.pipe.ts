import { Injectable, PipeTransform } from '@nestjs/common';

import { RawTopicChangeStatusRequestBody, TopicChangeStatusRequestBody } from '../topic.interface';

@Injectable()
export class ParseTopicChangeStatusPipe
  implements PipeTransform<RawTopicChangeStatusRequestBody, TopicChangeStatusRequestBody> {
  transform(value: RawTopicChangeStatusRequestBody): TopicChangeStatusRequestBody {
    const { action, note } = value;

    return {
      action: parseInt(action || ''),
      note
    };
  }
}
