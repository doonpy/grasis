export const LEC_MODEL_RESOURCE = {
  TABLE_NAME: 'lecturer',
  MODEL_NAME: 'l',

  FIELD_NAME: {
    LECTURER_ID: 'lecturerId',
    POSITION_ID: 'positionId',
    LEVEL: 'level',
    IS_ADMIN: 'isAdmin',
  },
  INDEX_NAME: {
    LECTURER_ID: 'idx_lecturerId',
    IS_ADMIN: 'idx_isAdmin',
  },
};

export const LEC_CONTROLLER_RESOURCE = {
  PATH: {
    ROOT: 'lecturers',
    SPECIFY: '/:id',
  },
  PARAM: {
    ID: 'id',
    USER: 'user',
    LECTURER: 'lecturer',
  },
};

export const LEC_ERROR_RESOURCE = {
  ERR_1: 'Mã giảng viên không tồn tại.',
  ERR_2: 'Mã giảng viên đã tồn tại.',
  ERR_3: 'Giảng viên không tồn tại.',
};
