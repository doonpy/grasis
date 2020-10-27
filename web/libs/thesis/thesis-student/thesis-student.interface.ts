import { Student } from '../../student/student.interface';
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
  students: string[];
}
