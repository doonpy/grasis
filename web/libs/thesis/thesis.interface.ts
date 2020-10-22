import { Moment } from 'moment';

import { Lecturer } from '../../../api/src/lecturer/lecturer.interface';
import { CommonColumns, CommonResponse } from '../common/common.interface';
import { ThesisLecturerRequestBody } from './thesis-lecturer/thesis-lecturer.interface';
import { ThesisStudentRequestBody } from './thesis-student/thesis-student.interface';
import { ThesisState, ThesisStatus } from './thesis.resource';

export interface Thesis extends CommonColumns {
  id: number;
  creator: number | Lecturer | null | undefined;
  startTime: string | Moment;
  endTime: string | Moment;
  state: ThesisState;
  lecturerTopicRegister: string | Moment;
  studentTopicRegister: string | Moment;
  progressReport: string | Moment;
  review: string | Moment;
  defense: string | Moment;
  status: ThesisStatus;
}

export type ThesisRequestBody = Partial<
  Omit<Thesis, keyof CommonColumns | 'id'> &
    ThesisLecturerRequestBody &
    ThesisStudentRequestBody &
    ThesisDuration
>;

export interface CreateThesisResponse extends CommonResponse {
  id: number;
}

export interface ThesisDuration {
  duration: [Moment, Moment];
}
