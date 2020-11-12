export enum Gender {
  MALE = 1,
  FEMALE
}

export enum UserStatus {
  INACTIVE = 1,
  ACTIVE
}

export enum IsAdmin {
  FALSE = 1,
  TRUE
}

export enum UserType {
  STUDENT = 1,
  LECTURER
}

export const USER_API_ROOT = 'users';

export const UserApi = {
  ROOT: '/users',
  SPECIFY: `${USER_API_ROOT}/@0`
};
