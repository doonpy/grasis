import { CommonColumns, CommonResponse } from '../common/common.interface';
import { Lecturer } from '../lecturer/lecturer.interface';
import { UserView } from '../user/user.interface';
import { ThesisLecturerRequestBody } from './thesis-lecturer/thesis-lecturer.interface';
import { ThesisStudentRequestBody } from './thesis-student/thesis-student.interface';
import { THESIS_STATE, THESIS_STATUS } from './thesis.resource';

export interface Thesis extends CommonColumns {
  id: number;
  creator: number | Lecturer | null | undefined;
  startTime: string;
  endTime: string;
  state: THESIS_STATE;
  lecturerTopicRegister: string;
  studentTopicRegister: string;
  progressReport: string;
  review: string;
  defense: string;
  status: THESIS_STATUS;
}

export type ThesisRequestBody = Omit<Thesis, keyof CommonColumns | 'id'> &
  ThesisLecturerRequestBody &
  ThesisStudentRequestBody;

export interface ThesisGetManyResponse extends CommonResponse {
  thesisList: Thesis[];
  total: number;
}

export interface ThesisCreateOrUpdateResponse extends CommonResponse {
  id: number;
}

export type CreatorView = Omit<
  UserView,
  'username' | 'gender' | 'email' | 'address' | 'phone' | 'isAdmin' | 'userType' | 'deletedAt'
> | null;

export interface ThesisView extends Thesis {
  creatorView: CreatorView;
}

export interface ThesisGetByIdResponse extends CommonResponse {
  thesis: ThesisView;
}
