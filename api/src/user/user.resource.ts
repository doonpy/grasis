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
    STATUS: 'status',
    IS_ADMIN: 'isAdmin',
    USER_TYPE: 'userType'
  },
  INDEX_NAME: {
    USERNAME: 'idx_username',
    IS_ADMIN: 'idx_isAdmin',
    USER_TYPE: 'idx_userType'
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

export const USER_SELECT_ATTRIBUTES = [
  USER_MODEL_RESOURCE.FIELD_NAME.USERNAME,
  USER_MODEL_RESOURCE.FIELD_NAME.FIRSTNAME,
  USER_MODEL_RESOURCE.FIELD_NAME.LASTNAME,
  USER_MODEL_RESOURCE.FIELD_NAME.GENDER,
  USER_MODEL_RESOURCE.FIELD_NAME.EMAIL,
  USER_MODEL_RESOURCE.FIELD_NAME.ADDRESS,
  USER_MODEL_RESOURCE.FIELD_NAME.PHONE,
  USER_MODEL_RESOURCE.FIELD_NAME.STATUS,
  USER_MODEL_RESOURCE.FIELD_NAME.IS_ADMIN,
  USER_MODEL_RESOURCE.FIELD_NAME.USER_TYPE
];
