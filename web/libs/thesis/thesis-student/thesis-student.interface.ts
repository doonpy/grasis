import { Student } from '../../student/student.interface';
import { UserViewType } from '../../user/user.interface';
import { Thesis } from '../thesis.interface';

export interface ThesisStudent {
  thesisId: number;
  studentId: number;
  // TODO: This will be Topic type when Topic was implemented.
  topic: number | null;
  instructorResult: number | null;
  reviewResult: number | null;
  defenseResult: number | null;
  student: Student;
  thesis: Thesis;
}

export interface ThesisStudentRequestBody {
  students: number[];
}

export type ThesisStudentViewItem = Omit<
  UserViewType,
  'username' | 'gender' | 'email' | 'address' | 'phone' | 'isAdmin' | 'userType' | 'deletedAt'
>;

export type ThesisStudentView = ThesisStudentViewItem[];
