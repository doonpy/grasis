import { Moment } from 'moment';

import { CommonColumns, CommonResponse } from '../common/common.type';
import { Lecturer, LecturerForFastView, LecturerSearchAttendee } from '../lecturer/lecturer.type';
import { StudentSearchAttendee } from '../student/student.type';
import { ThesisLecturer } from './thesis-lecturer/thesis-lecturer.type';
import { ThesisStudent } from './thesis-student/thesis-student.type';
import { ThesisState, ThesisStatus } from './thesis.resource';

export interface Thesis extends CommonColumns {
  id: number;
  subject: string;
  creatorId: number;
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
  lecturers: ThesisLecturer[];
  students: ThesisStudent[];
}

export type ThesisRequestBody = Partial<
  Omit<Thesis, keyof CommonColumns | 'id' | 'lecturers' | 'students'> &
    AttendeesRequestBody &
    ThesisDuration
>;

export interface ThesisCreateOrUpdateResponse extends CommonResponse {
  id: number;
}

export interface ThesisDuration {
  duration: [Moment, Moment];
}

export interface UseTheses {
  isLoading: boolean;
  data?: ThesisFindManyResponse;
}

export interface ThesisFindManyResponse extends CommonResponse {
  theses: ThesisForListView[];
  total: number;
}

export interface ThesisGetByIdResponse extends CommonResponse {
  thesis: ThesisForView;
}

export interface UseThesis {
  isLoading: boolean;
  data?: ThesisGetByIdResponse;
}

export type ThesisForEdit = Omit<Thesis, 'lecturers' | 'students'> & {
  lecturerAttendees: LecturerSearchAttendee[];
  studentAttendees: StudentSearchAttendee[];
};

export interface ThesisGetByIdForEditResponse extends CommonResponse {
  thesis: ThesisForEdit;
}

export interface AttendeesRequestBody {
  attendees: {
    lecturers: string[];
    students: string[];
  };
}

export interface ThesisSwitchStatusResponse extends CommonResponse {
  currentStatus: ThesisStatus;
}

export interface ThesisForListView {
  id: number;
  creatorId: number;
  subject: string;
  startTime: Date;
  endTime: Date;
  state: ThesisState;
  status: ThesisStatus;
  creator: LecturerForFastView;
}

export type ThesisForView = Omit<Thesis, 'deletedAt' | 'creator'> & {
  creator: LecturerForFastView;
};

export interface ThesisSearchLecturerInThesis extends CommonResponse {
  result: LecturerForFastView[];
}
