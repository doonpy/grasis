import { CommonResponse } from '../../common/common.interface';
import { Lecturer } from '../../lecturer/lecturer.interface';
import { Gender } from '../../user/user.resource';
import { Thesis } from '../thesis.interface';

export interface ThesisLecturer {
  thesisId: number;
  lecturerId: number;
  thesis: Thesis;
  lecturer: Lecturer;
}

export interface ThesisLecturerForView {
  id: number;
  firstname: string | null;
  lastname: string | null;
  gender: Gender | null;
  lecturerId: string | null;
}

export interface ThesisGetLecturersResponse extends CommonResponse {
  lecturers: ThesisLecturerForView[];
  total: number;
}

export interface UseThesisLecturers {
  isLoading: boolean;
  data?: ThesisGetLecturersResponse;
}
