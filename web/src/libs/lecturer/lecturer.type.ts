import { CommonColumns, CommonResponse } from '../common/common.type';
import { Thesis } from '../thesis/thesis.type';
import {
  User,
  UserForFastView,
  UserForListView,
  UserRequestBody,
  UserViewType
} from '../user/user.type';

export interface Lecturer extends CommonColumns {
  id: number;
  lecturerId: string | null;
  level: string | string[] | null;
  position: string | null;
  user: User;
  theses: Thesis[];
}

export type LecturerRequestBody = WithOptional<
  Omit<Lecturer, keyof CommonColumns | 'id' | 'theses' | 'user'>,
  'lecturerId' | 'level' | 'position'
>;

export interface UseLecturers {
  isLoading: boolean;
  data?: FindManyLecturerResponse;
}

export interface UseLecturer {
  isLoading: boolean;
  data?: FindOneLecturerResponse;
}

export interface FindManyLecturerResponse extends CommonResponse {
  lecturers: LecturerForListView[];
  total: number;
}

export interface FindOneLecturerResponse extends CommonResponse {
  lecturer: Lecturer;
}

export interface CreateLecturerResponse extends CommonResponse {
  id: number;
}

export type LecturerViewType = Lecturer & UserViewType;

export interface LecturerSearchAttendee {
  id: number;
  attendeeId: string | null;
  fullName: string;
}

export interface LecturerSearchAttendeesResponse extends CommonResponse {
  result: LecturerSearchAttendee[];
}

export interface LecturerForm {
  lecturer?: LecturerRequestBody;
  user?: UserRequestBody;
}

export type LecturerForListView = Pick<Lecturer, 'id' | 'lecturerId'> & UserForListView;

export type LecturerForFastView = Pick<Lecturer, 'id' | 'lecturerId' | 'deletedAt'> &
  UserForFastView;
