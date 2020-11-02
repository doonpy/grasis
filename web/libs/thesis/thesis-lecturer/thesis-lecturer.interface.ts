import { Lecturer } from '../../lecturer/lecturer.interface';
import { Thesis } from '../thesis.interface';

export interface ThesisLecturer {
  thesisId: number;
  lecturerId: number;
  thesis: Thesis;
  lecturer: Lecturer;
}
