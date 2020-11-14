import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { RequestDataType } from '../common.resource';

export const REQUEST_DATA_TYPE_KEY = 'requestDataType';

export const UseRequestDataType: (type: RequestDataType) => CustomDecorator = (type) =>
  SetMetadata(REQUEST_DATA_TYPE_KEY, type);
