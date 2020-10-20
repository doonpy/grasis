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
  ERR_1: 'Người dùng không tồn tại.',
  ERR_2: 'Tên đăng nhập đã tồn tại.',
  ERR_3: 'Mật khẩu xác nhận không chính xác.',
  ERR_4: 'Mật khẩu không hợp lệ.',
  ERR_5: 'Bạn không có quyền thực hiện tác vụ này.',
  ERR_6: 'Bạn không thể xóa chính mình.',
  ERR_7: 'Sinh viên không thể là quản trị viên.',
  ERR_8: 'Bạn không thể chỉnh sửa quyền quản trị của chính mình.'
};
