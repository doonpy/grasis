export const LEC_ENTITY_RESOURCE = {
  TABLE_NAME: 'lecturer'
};

export const LEC_CONTROLLER_RESOURCE = {
  PATH: {
    ROOT: 'lecturers',
    SPECIFY: '/:id'
  },
  PARAM: {
    ID: 'id',
    USER: 'user',
    LECTURER: 'lecturer',
    IS_LIST: 'isList'
  }
};

export const LEC_ERROR_RESOURCE = {
  ERR_1: 'Mã giảng viên không tồn tại.',
  ERR_2: 'Mã giảng viên đã tồn tại.',
  ERR_3: 'Giảng viên không tồn tại.'
};

export const LECTURER_LEVELS = ['Tiến sĩ', 'Thạc sĩ', 'Phó giáo sư', 'Giáo sư'];
