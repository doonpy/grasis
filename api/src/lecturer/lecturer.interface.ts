import { CommonColumns, CommonFindAllResponse, CommonResponse } from '../common/common.interface';
import { User, UserRequestBody, UserView } from '../user/user.interface';

export interface Lecturer extends CommonColumns {
  id: number | User;
  lecturerId: string | null;
  level: string | null;
  position: string | null;
}

export type LecturerView = Lecturer & UserView;
export type LecturerRequestBody = Partial<
  Omit<Lecturer, keyof CommonColumns | 'id'> & UserRequestBody
>;

export interface SplitUserFromRequestBody {
  user: UserRequestBody;
  remain: LecturerRequestBody;
}

export interface LecturerFindAllResponse extends CommonFindAllResponse {
  lecturers: LecturerView[];
}

export interface LecturerFindByIdResponse extends CommonResponse {
  lecturer: LecturerView;
}

export interface LecturerCreateOrUpdateResponse extends CommonResponse {
  id: number;
}
