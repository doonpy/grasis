import { CommonColumns, CommonFindAllResponse, CommonResponse } from '../common/common.interface';
import { User, UserRequestBody, UserRequestBodyForUser, UserView } from '../user/user.interface';

export interface Student extends CommonColumns {
  id: number | User;
  studentId: string;
  schoolYear: string;
  isGraduate: number;
  class: string;
}

export type StudentView = Student & UserView;
export type StudentRequestBody = Partial<Omit<Student, keyof CommonColumns> & UserRequestBody>;

export interface SplitUserFromRequestBody {
  user: UserRequestBody;
  remain: StudentRequestBody;
}

export interface StudentFindAllResponse extends CommonFindAllResponse {
  students: StudentView[];
}

export interface StudentFindByIdResponse extends CommonResponse {
  student: StudentView;
}

export interface StudentCreateOrUpdateResponse extends CommonResponse {
  id: number;
}

export type StudentRequestBodyForUser = UserRequestBodyForUser;
