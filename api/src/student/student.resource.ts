export const STD_MODEL_RESOURCE = {
  TABLE_NAME: 'student',
  MODEL_NAME: 's',

  FIELD_NAME: {
    USER_ID: 'userId',
    STUDENT_ID: 'studentId',
    USERNAME: 'username',
    PASSWORD: 'password',
    FIRSTNAME: 'firstname',
    LASTNAME: 'lastname',
    GENDER: 'gender',
    SCHOOL_YEAR: 'schoolYear',
    EMAIL: 'email',
    ADDRESS: 'address',
    PHONE: 'phone',
    STATUS: 'status',
  },
  INDEX_NAME: {
    STUDENT_ID: 'idx_studentId',
    USERNAME: 'idx_username',
    FIRSTNAME: 'idx_firstname',
    LASTNAME: 'idx_lastname',
    SCHOOL_YEAR: 'idx_school_year',
    STATUS: 'idx_status',
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
  STD_ERR_1: 'Mã sinh viên đã tồn tại.',
  STD_ERR_2: 'Mã người dùng đã tồn tại.',
  STD_ERR_3: 'Sinh viên không tồn tại.',
};
