import { CommonColumns, CommonResponse } from '../common/common.type';
import { Thesis } from '../thesis/thesis.type';
import { User, UserForFastView, UserForListView, UserRequestBody } from '../user/user.type';
import { IsGraduate } from './student.resource';

export interface Student extends CommonColumns {
  id: number;
  studentId: string | null;
  schoolYear: string | null;
  studentClass: string | null;
  isGraduate: IsGraduate | boolean;
  user: User;
  theses: Thesis[];
}

export type StudentRequestBody = WithOptional<
  Omit<Student, keyof CommonColumns | 'id' | 'theses' | 'user'>,
  'studentId' | 'studentClass' | 'schoolYear' | 'isGraduate'
>;

export interface UseStudents {
  isLoading: boolean;
  data?: FindManyStudentResponse;
}

export interface UseStudent {
  isLoading: boolean;
  data?: FindOneStudentResponse;
}

export interface FindManyStudentResponse extends CommonResponse {
  students: StudentForListView[];
  total: number;
}

export interface FindOneStudentResponse extends CommonResponse {
  student: Student;
}

export interface CreateStudentResponse extends CommonResponse {
  id: number;
}

export interface StudentSearchAttendee {
  id: number;
  attendeeId: string | null;
  fullName: string;
  schoolYear: string | null;
  studentClass: string | null;
}

export interface StudentSearchAttendeesResponse extends CommonResponse {
  result: StudentSearchAttendee[];
}

export interface StudentForm {
  student?: StudentRequestBody;
  user?: UserRequestBody;
}

export type StudentForListView = Pick<Student, 'id' | 'studentId'> & UserForListView;

export type StudentForFastView = Pick<Student, 'id' | 'studentId' | 'deletedAt'> & UserForFastView;
