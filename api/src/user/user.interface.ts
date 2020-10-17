import { LecturerRequestBody } from '../lecturer/lecturer.interface';
import { StudentRequestBody } from '../student/student.interface';
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
  status: UserStatus;
  isAdmin: IsAdmin;
  userType: UserType;
  refreshToken: string | null;
  deletedAt: string | null;
}

export interface UserRequestBody extends Partial<Omit<User, 'id' | 'deletedAt' | 'refreshToken'>> {
  confirmPassword?: string;
}

export type UserView = Omit<User, 'password' | 'refreshToken'>;
export type UserAuth = Omit<
  User,
  'firstname' | 'lastname' | 'gender' | 'email' | 'address' | 'phone' | 'userType' | 'refreshToken'
>;

export interface SplitUserFromRequestBody {
  user: UserRequestBody;
  remain: LecturerRequestBody | StudentRequestBody;
}

export type UserRequestBodyForUser = Omit<
  UserRequestBody,
  'username' | 'firstname' | 'lastname' | 'gender' | 'isAdmin' | 'status' | 'userType'
>;
