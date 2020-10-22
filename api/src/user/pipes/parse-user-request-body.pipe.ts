import { Injectable, PipeTransform } from '@nestjs/common';

import { RawUserRequestBody, UserRequestBody } from '../user.interface';

@Injectable()
export class ParseUserRequestBodyPipe
  implements PipeTransform<RawUserRequestBody, UserRequestBody | undefined> {
  public transform(value?: RawUserRequestBody): UserRequestBody | undefined {
    if (!value) {
      return;
    }

    const { gender, isAdmin, status } = value;
    const result: UserRequestBody = value;
    if (gender && !Number.isNaN(Number.parseInt(gender))) {
      result.gender = parseInt(gender);
    }

    if (isAdmin && !Number.isNaN(Number.parseInt(isAdmin))) {
      result.isAdmin = parseInt(isAdmin);
    }

    if (status && !Number.isNaN(Number.parseInt(status))) {
      result.status = parseInt(status);
    }

    return { ...value, ...result };
  }
}
