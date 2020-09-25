export const STD_MODEL_RESOURCE = {
  TABLE_NAME: 'student',
  MODEL_NAME: 's',

  FIELD_NAME: {
    USER_ID: 'userId',
    STUDENT_ID: 'studentId',
    SCHOOL_YEAR: 'schoolYear',
  },
  INDEX_NAME: {
    USER_ID: 'idx_userId',
    STUDENT_ID: 'idx_studentId',
  },
};

export const STD_CONTROLLER_RESOURCE = {
  PATH: {
    ROOT: 'students',
    SPECIFY: '/:id',
  },
  PARAM: {
    ID: 'id',
    USER: 'user',
    STUDENT: 'student',
  },
};

export const STD_ERROR_RESOURCE = {
  ERR_1: 'Mã sinh viên đã tồn tại.',
  ERR_2: 'Mã người dùng đã tồn tại.',
  ERR_3: 'Sinh viên không tồn tại.',
};
