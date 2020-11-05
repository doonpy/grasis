import { Moment } from 'moment';

import { CommonColumns, CommonResponse } from '../common/common.interface';
import { Lecturer, LecturerSearchAttendee } from '../lecturer/lecturer.interface';
import { StudentSearchAttendee } from '../student/student.interface';
import { ThesisLecturer } from './thesis-lecturer/thesis-lecturer.interface';
import { ThesisStudent } from './thesis-student/thesis-student.interface';
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
  creatorInfo: CreatorInfo;
}

export interface CreatorInfo {
  firstname: string | null;
  lastname: string | null;
  lecturerId: string | null;
}

export type ThesisForView = Omit<Thesis, 'deletedAt' | 'creator'> & { creatorInfo: CreatorInfo };
