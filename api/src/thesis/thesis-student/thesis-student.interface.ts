import { Student } from '../../student/student.interface';
import { UserView } from '../../user/user.interface';
import { Thesis } from '../thesis.interface';

export interface ThesisStudent {
  thesis: number | Thesis;
  student: number | Student;
  // TODO: This will be Topic type when Topic was implemented.
  topic: number | null;
  instructorResult: number | null;
  reviewResult: number | null;
  defenseResult: number | null;
}

export interface ThesisStudentRequestBody {
  students: number[];
}

export type ThesisStudentViewItem = Omit<
  UserView,
  'username' | 'gender' | 'email' | 'address' | 'phone' | 'isAdmin' | 'userType' | 'deletedAt'
>;

export type ThesisStudentView = ThesisStudentViewItem[];
