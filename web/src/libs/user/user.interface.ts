import { CommonColumns, CommonResponse } from '../common/common.interface';
import { Gender, IsAdmin, UserStatus, UserType } from './user.resource';

export interface User {
  id: number;
  username: string;
  password: string;
  firstname: string | null;
  lastname: string | null;
  gender: Gender | null;
  email: string | null;
  address: string | null;
  phone: string | null;
  status: UserStatus | boolean;
  isAdmin: IsAdmin | boolean;
  userType: UserType;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserRequestBody extends Partial<Omit<User, keyof CommonColumns | 'id'>> {
  confirmPassword?: string;
}

export type UserViewType = Omit<User, keyof CommonColumns | 'password' | 'userType'>;
export interface FindUserByIdResponse extends CommonResponse {
  user: User;
}

export interface LoginInputs {
  username: string;
  password: string;
  remember: boolean;
}

export interface Remember {
  username: string;
}

export interface UseAuthorizationParams {
  isAdminCheck?: boolean;
  allowUserTypes?: UserType[];
}

export type UserForListView = Pick<
  User,
  'username' | 'firstname' | 'lastname' | 'gender' | 'status'
>;

export type UserForFastView = Pick<User, 'firstname' | 'lastname'>;

export type UserForCommentView = Pick<User, 'id' | 'firstname' | 'lastname'>;
