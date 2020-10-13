import { CommonColumns, CommonResponse } from '../common/common.interface';
import { User, UserRequestBody, UserViewType } from '../user/user.interface';

export interface Lecturer extends CommonColumns {
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
  total: number;
}

export interface CreateLecturerResponse extends CommonResponse {
  id: number;
}

export type LecturerViewType = Omit<Lecturer, 'id'> & UserViewType;
export type LecturerRequestBody = Partial<
  Omit<Lecturer, keyof CommonColumns | 'id'> & UserRequestBody
>;
