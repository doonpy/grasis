import { THESIS_TABLE } from '../thesis.resource';

export const THESIS_STUDENT_TABLE = `${THESIS_TABLE}_student`;

export enum ThesisStudentColumn {
  THESIS_ID = 'thesis_id',
  STUDENT_ID = 'student_id',
  TOPIC = 'topic',
  INSTRUCTOR_RESULT = 'instructor_result',
  REVIEW_RESULT = 'review_result',
  DEFENSE_RESULT = 'defense_result'
}

export enum ThesisStudentError {
  ERR_1 = 'Sinh viên %s đang tham gia một khóa luận khác.'
}

export enum ThesisStudentRelation {
  THESIS = 'thesis',
  STUDENT = 'student'
}
