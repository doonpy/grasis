import { CommonColumns } from '../common/common.interface';
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
