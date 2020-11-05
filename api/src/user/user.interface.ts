import { CommonColumns } from '../common/common.interface';
import { UserEntity } from './user.entity';

export type User = UserEntity;

export type UserRequestBody = WithOptional<
  Omit<User, keyof CommonColumns | 'id'>,
  | 'password'
  | 'firstname'
  | 'lastname'
  | 'gender'
  | 'email'
  | 'address'
  | 'phone'
  | 'userType'
  | 'status'
> & {
  confirmPassword?: string;
};

export type RawUserRequestBody = { [K in keyof UserRequestBody]: any };

export type UserAuth = Omit<
  User,
  'firstname' | 'lastname' | 'gender' | 'email' | 'address' | 'phone' | 'userType'
>;

export type UserRequestBodyForUser = Omit<
  UserRequestBody,
  'username' | 'firstname' | 'lastname' | 'gender' | 'isAdmin' | 'status' | 'userType'
>;

export type UserForListView = Pick<
  User,
  'username' | 'firstname' | 'lastname' | 'gender' | 'status'
>;
