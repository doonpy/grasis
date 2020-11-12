import { CommonColumns, CommonResponse } from '../common/common.type';
import { LecturerSearchAttendee } from '../lecturer/lecturer.type';
import { StudentSearchAttendee } from '../student/student.type';
import { ThesisEntity } from './thesis.entity';
import { ThesisState, ThesisStatus } from './thesis.resource';

export type Thesis = ThesisEntity;

export type ThesisRequestBody = WithOptional<
  Omit<
    Thesis,
    keyof CommonColumns | 'id' | 'creator' | 'students' | 'lecturers' | 'state' | 'status'
  > &
    ThesisAttendeesRequestBody,
  keyof ThesisAttendeesRequestBody
>;

export interface ThesisAttendeesRequestBody {
  attendees: {
    lecturers: number[];
    students: number[];
  };
}

export interface ThesisGetManyResponse extends CommonResponse {
  theses: ThesisForListView[];
  total: number;
}

export interface ThesisCreateOrUpdateResponse extends CommonResponse {
  id: number;
}

export interface ThesisGetByIdResponse extends CommonResponse {
  thesis: ThesisForView;
}

export type RawThesisRequestBody = {
  [K in keyof ThesisRequestBody]?: any;
};

export type ThesisForEdit = Omit<Thesis, 'lecturers' | 'students'> & {
  lecturerAttendees: LecturerSearchAttendee[];
  studentAttendees: StudentSearchAttendee[];
};

export interface ThesisGetByIdForEditResponse extends CommonResponse {
  thesis: ThesisForEdit;
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

interface CreatorInfo {
  firstname: string | null;
  lastname: string | null;
  lecturerId: string | null;
}

export type ThesisForView = Omit<Thesis, 'deletedAt' | 'creator'> & { creatorInfo: CreatorInfo };
