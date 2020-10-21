import { Lecturer } from '../../lecturer/lecturer.interface';
import { UserView } from '../../user/user.interface';
import { Thesis } from '../thesis.interface';

export interface ThesisLecturer {
  thesis: number | Thesis;
  lecturer: number | Lecturer;
}

export interface ThesisLecturerRequestBody {
  lecturers: number[];
}

export type ThesisLecturerViewItem = Omit<
  UserView,
  'username' | 'gender' | 'email' | 'address' | 'phone' | 'isAdmin' | 'userType' | 'deletedAt'
>;

export type ThesisLecturerView = ThesisLecturerViewItem[];
