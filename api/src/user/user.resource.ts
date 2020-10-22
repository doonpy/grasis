export enum Gender {
  MALE = 1,
  FEMALE = 2
}

export enum UserStatus {
  INACTIVE = 1,
  ACTIVE = 2
}

export enum IsAdmin {
  FALSE = 1,
  TRUE = 2
}

export enum UserType {
  STUDENT = 1,
  LECTURER = 2
}

export const USER_TABLE = 'user';

export enum UserPath {
  ROOT = 'users',
  SPECIFY = '/:id'
}

export enum UserError {
  ERR_1 = 'Người dùng không tồn tại.',
  ERR_2 = 'Tên đăng nhập đã tồn tại.',
  ERR_3 = 'Mật khẩu xác nhận không chính xác.',
  ERR_4 = 'Mật khẩu không hợp lệ.',
  ERR_5 = 'Bạn không có quyền thực hiện tác vụ này.',
  ERR_6 = 'Bạn không thể xóa chính mình.',
  ERR_7 = 'Sinh viên không thể là quản trị viên.',
  ERR_8 = 'Bạn không thể chỉnh sửa quyền quản trị của chính mình.',
  ERR_9 = 'Người dùng %s đang ngưng hoạt động.',
  ERR_10 = 'Tham số người dùng thông tin là bắt buộc.'
}

export enum UserColumn {
  USERNAME = 'username',
  PASSWORD = 'password',
  FIRSTNAME = 'firstname',
  LASTNAME = 'lastname',
  GENDER = 'gender',
  EMAIL = 'email',
  ADDRESS = 'address',
  PHONE = 'phone',
  STATUS = 'status',
  IS_ADMIN = 'is_admin',
  USER_TYPE = 'user_type'
}
