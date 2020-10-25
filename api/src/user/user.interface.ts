import { WithOptional } from '../common/common.interface';
import { UserEntity } from './user.entity';

export type User = UserEntity;

export type UserRequestBody = WithOptional<
  User,
  | 'password'
  | 'firstname'
  | 'lastname'
  | 'gender'
  | 'email'
  | 'address'
  | 'phone'
  | 'userType'
  | 'id'
  | 'deletedAt'
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
