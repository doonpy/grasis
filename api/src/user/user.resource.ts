import { User } from './user.entity';

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

export const USER_ENTITY_RESOURCE = {
  TABLE_NAME: 'user'
};

export const USER_CONTROLLER_RESOURCE = {
  PATH: {
    ROOT: 'users',
    SPECIFY: '/:id'
  },
  PARAM: {
    ID: 'id'
  }
};

export const USER_ERROR_RESOURCE = {
  USER_ERR_1: 'Người dùng không tồn tại.',
  USER_ERR_2: 'Tên người dùng đã tồn tại.',
  USER_ERR_3: 'Mật khẩu xác nhận không chính xác.',
  USER_ERR_4: 'Mật khẩu không hợp lệ.'
};

export interface UserRequestBody extends User {
  confirmPassword: string;
}
