import { CommonColumns, CommonResponse } from '../common/common.interface';
import { User, UserRequestBody, UserViewType } from '../user/user.interface';
import { IsGraduate } from './student.resource';

export interface Student extends CommonColumns {
  id: number | User;
  studentId: string | null;
  schoolYear: string | null;
  studentClass: string | null;
  isGraduate: IsGraduate | null;
}

export interface UseStudents {
  isLoading: boolean;
  data: FindAllStudentResponse;
}

export interface UseStudent {
  isLoading: boolean;
  data: FindOneStudentResponse;
}

export interface FindAllStudentResponse extends CommonResponse {
  students: StudentViewType[];
  total: number;
}

export interface FindOneStudentResponse extends CommonResponse {
  student: StudentViewType;
}

export interface CreateStudentResponse extends CommonResponse {
  id: number;
}

export type StudentViewType = Student & UserViewType;
export type StudentRequestBody = Partial<Omit<Student, keyof CommonColumns> & UserRequestBody>;
