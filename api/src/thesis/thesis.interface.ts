import { CommonColumns, CommonResponse, WithOptional } from '../common/common.interface';
import { Lecturer } from '../lecturer/lecturer.interface';
import { ThesisStudent } from './thesis-student/thesis-student.interface';
import { ThesisEntity } from './thesis.entity';

export type Thesis = ThesisEntity;

export type ThesisRequestBody = WithOptional<
  Omit<Thesis, keyof CommonColumns | 'id' | 'creator' | 'students' | 'lecturers'> &
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
  lecturers: Lecturer[];
  isMoreLecturers: boolean;
}

export interface ThesisLoadMoreStudentsResponse extends CommonResponse {
  students: ThesisStudent[];
  isMoreStudents: boolean;
}
