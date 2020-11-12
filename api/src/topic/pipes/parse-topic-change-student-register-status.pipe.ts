import { Injectable, PipeTransform } from '@nestjs/common';

import {
  RawTopicChangeStudentRegisterStatusRequestBody,
  TopicChangeStudentRegisterStatusRequestBody
} from '../topic.type';

@Injectable()
export class ParseTopicChangeStudentRegisterStatusPipe
  implements
    PipeTransform<
      RawTopicChangeStudentRegisterStatusRequestBody,
      TopicChangeStudentRegisterStatusRequestBody
    > {
  transform(
    value: RawTopicChangeStudentRegisterStatusRequestBody
  ): TopicChangeStudentRegisterStatusRequestBody {
    const { status } = value;

    return {
      status: parseInt(status || '')
    };
  }
}
