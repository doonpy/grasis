export const USER_MODEL_RESOURCE = {
  TABLE_NAME: 'user',
  MODEL_NAME: 'u',
  FIELD_NAME: {
    USERNAME: 'username',
    PASSWORD: 'password',
    FIRSTNAME: 'firstname',
    LASTNAME: 'lastname',
    GENDER: 'gender',
    EMAIL: 'email',
    ADDRESS: 'address',
    PHONE: 'phone',
    STATUS: 'status'
  },
  INDEX_NAME: {
    USERNAME: 'idx_username'
  }
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
  USER_ERR_2: 'Tên người dùng đã tồn tại.'
};
