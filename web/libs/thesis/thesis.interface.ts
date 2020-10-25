import { Moment } from 'moment';

import { CommonColumns, CommonResponse } from '../common/common.interface';
import { Lecturer } from '../lecturer/lecturer.interface';
import { ThesisLecturerRequestBody } from './thesis-lecturer/thesis-lecturer.interface';
import { ThesisStudent, ThesisStudentRequestBody } from './thesis-student/thesis-student.interface';
import { ThesisState, ThesisStatus } from './thesis.resource';

export interface Thesis extends CommonColumns {
  id: number;
  subject: string;
  creatorId: number | null;
  startTime: string | Moment;
  endTime: string | Moment;
  state: ThesisState;
  lecturerTopicRegister: string | Moment;
  studentTopicRegister: string | Moment;
  progressReport: string | Moment;
  review: string | Moment;
  defense: string | Moment;
  status: ThesisStatus;
  creator: Lecturer | null;
  lecturers: Lecturer[];
  students: ThesisStudent[];
}

export type ThesisRequestBody = Partial<
  Omit<Thesis, keyof CommonColumns | 'id'> &
    ThesisLecturerRequestBody &
    ThesisStudentRequestBody &
    ThesisDuration
>;

export interface ThesisCreateResponse extends CommonResponse {
  id: number;
}

export interface ThesisDuration {
  duration: [Moment, Moment];
}

export interface UseTheses {
  isLoading: boolean;
  data: ThesisFindManyResponse;
}

export interface ThesisFindManyResponse extends CommonResponse {
  theses: Thesis[];
  total: number;
}

export interface ThesisGetByIdResponse extends CommonResponse {
  thesis: Thesis;
  isMoreStudents: boolean;
  isMoreLecturers: boolean;
}

export interface UseThesis {
  isLoading: boolean;
  data: ThesisGetByIdResponse;
}

export interface ThesisLoadMoreLecturersResponse extends CommonResponse {
  lecturers: Lecturer[];
  isMoreLecturers: boolean;
}

export interface ThesisLoadMoreStudentsResponse extends CommonResponse {
  students: ThesisStudent[];
  isMoreStudents: boolean;
}
