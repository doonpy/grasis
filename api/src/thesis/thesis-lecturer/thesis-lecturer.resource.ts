import { THESIS_TABLE } from '../thesis.resource';

export const THESIS_LECTURER_TABLE = `${THESIS_TABLE}_lecturer`;

export enum ThesisLecturerColumn {
  THESIS_ID = 'thesis_id',
  LECTURER_ID = 'lecturer_id'
}

export enum ThesisLecturerRelation {
  THESIS = 'thesis',
  LECTURER = 'lecturer'
}
