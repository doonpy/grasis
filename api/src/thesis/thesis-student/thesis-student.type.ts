import { CommonResponse } from '../../common/common.type';
import { Gender } from '../../user/user.resource';
import { ThesisStudentEntity } from './thesis-student.entity';

export type ThesisStudent = ThesisStudentEntity;

export interface ThesisStudentForView {
  id: number;
  firstname: string | null;
  lastname: string | null;
  gender: Gender | null;
  studentId: string | null;
  schoolYear: string | null;
  studentClass: string | null;
}

export interface ThesisGetThesisStudentsResponse extends CommonResponse {
  students: ThesisStudentForView[];
  total: number;
}
