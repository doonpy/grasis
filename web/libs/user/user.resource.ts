import { UserViewType } from './user.interface';

export enum Gender {
  MALE = 0,
  FEMALE = 1
}

export enum UserStatus {
  INACTIVE = 0,
  ACTIVE = 1
}

export enum IsAdmin {
  FALSE = 0,
  TRUE = 1
}

export enum UserType {
  STUDENT = 0,
  LECTURER = 1
}

export const INITIAL_USER: UserViewType = {
  id: NaN,
  username: null,
  firstname: null,
  lastname: null,
  gender: null,
  email: null,
  address: null,
  phone: null,
  status: null,
  isAdmin: null
};

export const USER_API = {
  ROOT: '/users'
};
