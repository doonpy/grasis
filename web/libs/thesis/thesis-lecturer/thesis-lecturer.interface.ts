import { LecturerViewType } from '../../lecturer/lecturer.interface';
import { UserViewType } from '../../user/user.interface';
import { Thesis } from '../thesis.interface';

export interface ThesisLecturer {
  thesis: number | Thesis;
  lecturer: number | LecturerViewType;
}

export interface ThesisLecturerRequestBody {
  lecturers: number[];
}

export type ThesisLecturerViewItem = Omit<
  UserViewType,
  'username' | 'gender' | 'email' | 'address' | 'phone' | 'isAdmin' | 'userType' | 'deletedAt'
>;

export type ThesisLecturerView = ThesisLecturerViewItem[];
