import { CommonResponse } from '../../common/common.type';
import { Lecturer } from '../../lecturer/lecturer.type';
import { Gender } from '../../user/user.resource';
import { Thesis } from '../thesis.type';

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
