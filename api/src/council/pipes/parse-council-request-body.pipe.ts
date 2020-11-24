import { Injectable, PipeTransform } from '@nestjs/common';

import { CouncilRequestBody, RawCouncilRequestBody } from '../council.type';

@Injectable()
export class ParseCouncilRequestBodyPipe
  implements PipeTransform<RawCouncilRequestBody, CouncilRequestBody> {
  transform({
    name,
    thesisId,
    chairmanId,
    instructorId,
    commissionerId
  }: RawCouncilRequestBody): CouncilRequestBody {
    return {
      name: name || '',
      thesisId: parseInt(thesisId || ''),
      chairmanId: parseInt(chairmanId || ''),
      instructorId: parseInt(instructorId || ''),
      commissionerId: parseInt(commissionerId || '')
    };
  }
}
