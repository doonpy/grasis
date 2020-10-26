import { Injectable, PipeTransform } from '@nestjs/common';

import { RawThesisRequestBody, ThesisRequestBody } from '../thesis.interface';

@Injectable()
export class ParseThesisRequestBodyPipe
  implements PipeTransform<RawThesisRequestBody, ThesisRequestBody> {
  transform(value: RawThesisRequestBody): ThesisRequestBody {
    const { attendees, creatorId } = value;
    const result: RawThesisRequestBody = { attendees: { lecturers: [], students: [] } };
    if (attendees && Array.isArray(attendees.lecturers)) {
      result.attendees!.lecturers = attendees.lecturers.map((lecturer: string) =>
        parseInt(lecturer)
      );
    }

    if (attendees && Array.isArray(attendees.students)) {
      result.attendees!.students = attendees.students.map((student: string) => parseInt(student));
    }

    if (creatorId && !Number.isNaN(Number.parseInt(creatorId))) {
      result.creatorId = parseInt(creatorId);
    }

    return <ThesisRequestBody>{ ...value, ...result };
  }
}
