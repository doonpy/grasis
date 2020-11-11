import { BadRequestException, HttpException, PayloadTooLargeException } from '@nestjs/common';

import { UploadError } from '../upload.resource';
import { multerExceptions } from './multer.constants';

export function transformException(error: Error | undefined): Error | undefined {
  if (!error || error instanceof HttpException) {
    return error;
  }
  switch (error.message) {
    case multerExceptions.LIMIT_FILE_SIZE:
      return new PayloadTooLargeException(UploadError.ERR_8);
    case multerExceptions.LIMIT_FILE_COUNT:
    case multerExceptions.LIMIT_FIELD_KEY:
    case multerExceptions.LIMIT_FIELD_VALUE:
    case multerExceptions.LIMIT_FIELD_COUNT:
    case multerExceptions.LIMIT_UNEXPECTED_FILE:
      return new BadRequestException(UploadError.ERR_6);
    case multerExceptions.LIMIT_PART_COUNT:
      return new BadRequestException(error.message);
  }
  return error;
}
