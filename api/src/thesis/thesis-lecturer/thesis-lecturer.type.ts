import { CommonResponse } from '../../common/common.type';
import { Gender } from '../../user/user.resource';
import { ThesisLecturerEntity } from './thesis-lecturer.entity';

export type ThesisLecturer = ThesisLecturerEntity;

export interface ThesisLecturerForView {
  id: number;
  firstname: string | null;
  lastname: string | null;
  gender: Gender | null;
  lecturerId: string | null;
}

export interface ThesisGetThesisLecturersResponse extends CommonResponse {
  lecturers: ThesisLecturerForView[];
  total: number;
}
