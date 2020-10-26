import { CommonColumns, CommonResponse, WithOptional } from '../common/common.interface';
import { LecturerSearchAttendee } from '../lecturer/lecturer.interface';
import { StudentSearchAttendee } from '../student/student.interface';
import { ThesisLecturer } from './thesis-lecturer/thesis-lecturer.interface';
import { ThesisStudent } from './thesis-student/thesis-student.interface';
import { ThesisEntity } from './thesis.entity';
import { ThesisStatus } from './thesis.resource';

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
  theses: Thesis[];
  total: number;
}

export interface ThesisCreateOrUpdateResponse extends CommonResponse {
  id: number;
}

export interface ThesisGetByIdResponse extends CommonResponse {
  thesis: Thesis;
  isMoreStudents: boolean;
  isMoreLecturers: boolean;
}

export type RawThesisRequestBody = {
  [K in keyof ThesisRequestBody]?: any;
};

export interface ThesisLoadMoreLecturersResponse extends CommonResponse {
  lecturers: ThesisLecturer[];
  isMoreLecturers: boolean;
}

export interface ThesisLoadMoreStudentsResponse extends CommonResponse {
  students: ThesisStudent[];
  isMoreStudents: boolean;
}

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
