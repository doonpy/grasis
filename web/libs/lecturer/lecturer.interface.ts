import { CommonColumns, CommonResponse } from '../common/common.interface';
import { User, UserRequestBody, UserViewType } from '../user/user.interface';

export interface Student extends CommonColumns {
  id: number | User;
  lecturerId: string | null;
  level: string | string[] | null;
  position: string | null;
}

export interface UseLecturers {
  isLoading: boolean;
  data: FindAllLecturerResponse;
}

export interface UseLecturer {
  isLoading: boolean;
  data: FindOneLecturerResponse;
}

export interface FindAllLecturerResponse extends CommonResponse {
  lecturers: LecturerViewType[];
  total: number;
}

export interface FindOneLecturerResponse extends CommonResponse {
  lecturer: LecturerViewType;
}

export interface CreateLecturerResponse extends CommonResponse {
  id: number;
}

export type LecturerViewType = Student & UserViewType;
export type StudentRequestBody = Partial<Omit<Student, keyof CommonColumns> & UserRequestBody>;
