import { CommonResponse } from '../../common/common.type';
import { Student } from '../../student/student.type';
import { Gender } from '../../user/user.resource';
import { Thesis } from '../thesis.type';

export interface ThesisStudent {
  thesisId: number;
  studentId: number;
  instructorResult: number | null;
  reviewResult: number | null;
  defenseResult: number | null;
  student: Student;
  thesis: Thesis;
}

export interface ThesisStudentForView {
  id: number;
  firstname: string | null;
  lastname: string | null;
  gender: Gender | null;
  studentId: string | null;
  schoolYear: string | null;
  studentClass: string | null;
}

export interface ThesisGetStudentsResponse extends CommonResponse {
  students: ThesisStudentForView[];
  total: number;
}

export interface UseThesisStudents {
  isLoading: boolean;
  data?: ThesisGetStudentsResponse;
}
