import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RequestDataType } from '../common/common.resource';
import { REQUEST_DATA_TYPE_KEY } from '../common/decorators/request-data-type.decorator';
import { ProgressReportQuery } from '../progress-report/progress-report.resource';

export function getTopicIdFromRequest(context: ExecutionContext, reflector: Reflector): number {
  const request = context.switchToHttp().getRequest<Express.CustomRequest>();
  const requestDataType = reflector.get<RequestDataType>(
    REQUEST_DATA_TYPE_KEY,
    context.getHandler()
  );

  let topicId = '';
  switch (requestDataType) {
    case RequestDataType.PARAM:
      topicId = request.params![ProgressReportQuery.TOPIC_ID];
      break;
    case RequestDataType.BODY:
      topicId = request.body![ProgressReportQuery.TOPIC_ID];
      break;
    case RequestDataType.QUERY:
      topicId = request.query![ProgressReportQuery.TOPIC_ID];
      break;
  }

  return parseInt(topicId);
}
