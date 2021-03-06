import { THESIS_TABLE } from '../thesis.resource';

export const THESIS_STUDENT_TABLE = `${THESIS_TABLE}_student`;

export const ThesisStudentColumn = {
  THESIS_ID: 'thesis_id',
  STUDENT_ID: 'student_id'
};

export const ThesisStudentError = {
  ERR_1: 'Sinh viên %s đang tham gia một khóa luận khác.',
  ERR_2: 'Sinh viên không tồn tại trong khóa luận.'
};
