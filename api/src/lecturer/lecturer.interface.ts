import { CommonColumns, CommonFindManyResponse, CommonResponse } from '../common/common.interface';
import { UserForFastView, UserForListView } from '../user/user.interface';
import { LecturerEntity } from './lecturer.entity';

export type Lecturer = LecturerEntity;

export type LecturerRequestBody = WithOptional<
  Omit<Lecturer, keyof CommonColumns | 'id' | 'theses' | 'user' | 'convertToFastView'>,
  'lecturerId' | 'level' | 'position'
>;

export interface LecturerFindManyResponse extends CommonFindManyResponse {
  lecturers: LecturerForListView[];
}

export interface LecturerFindByIdResponse extends CommonResponse {
  lecturer: Lecturer;
}

export interface LecturerCreateOrUpdateResponse extends CommonResponse {
  id: number;
}

export interface LecturerSearchAttendee {
  id: number;
  attendeeId: string | null;
  fullName: string;
}

export interface LecturerSearchAttendeesResponse extends CommonResponse {
  result: LecturerSearchAttendee[];
}

export type LecturerForListView = Pick<Lecturer, 'id' | 'lecturerId'> & UserForListView;

export type LecturerForFastView = Pick<Lecturer, 'id' | 'lecturerId' | 'deletedAt'> &
  UserForFastView;
