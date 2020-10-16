export const STD_ENTITY_RESOURCE = {
  TABLE_NAME: 'student'
};

export const STD_CONTROLLER_RESOURCE = {
  PATH: {
    ROOT: 'students',
    SPECIFY: '/:id',
    ADMIN_ROOT: 'admin/students'
  },
  PARAM: {
    USER: 'user',
    STUDENT: 'student'
  }
};

export const STD_ERROR_RESOURCE = {
  ERR_1: 'Mã sinh viên đã tồn tại.',
  ERR_2: 'Mã sinh viên không tồn tại.',
  ERR_3: 'Sinh viên không tồn tại.'
};

export enum IsGraduate {
  FALSE = 0,
  TRUE = 1
}
