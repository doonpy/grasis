import { Injectable, PipeTransform } from '@nestjs/common';

import { RawUserRequestBody, UserRequestBody } from '../user.interface';

@Injectable()
export class ParseUserRequestBodyPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public transform(value: RawUserRequestBody): UserRequestBody {
    const { gender, isAdmin, status } = value;
    const result: UserRequestBody = {};
    if (gender && !Number.isNaN(Number.parseInt(gender))) {
      result.gender = parseInt(gender);
    }

    if (isAdmin && !Number.isNaN(Number.parseInt(isAdmin))) {
      result.isAdmin = parseInt(isAdmin);
    }

    if (status && !Number.isNaN(Number.parseInt(status))) {
      result.status = parseInt(status);
    }

    return <UserRequestBody>{ ...value, ...result };
  }
}
