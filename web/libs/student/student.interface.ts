import { CommonColumns, CommonResponse, WithOptional } from '../common/common.interface';
import { Thesis } from '../thesis/thesis.interface';
import { User, UserRequestBody } from '../user/user.interface';
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
  data: FindManyStudentResponse;
}

export interface UseStudent {
  isLoading: boolean;
  data: FindOneStudentResponse;
}

export interface FindManyStudentResponse extends CommonResponse {
  students: Student[];
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
