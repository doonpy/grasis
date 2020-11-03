export const STUDENT_TABLE = 'student';

export const StudentError = {
  ERR_1: 'Mã sinh viên đã tồn tại.',
  ERR_2: 'Mã sinh viên không tồn tại.',
  ERR_3: 'Sinh viên không tồn tại.',
  ERR_4: 'Sinh viên @1 đang tham gia một khóa luận khác.',
  ERR_5: 'Sinh viên @1 đã tốt nghiệp.',
  ERR_6: 'Sinh viên đang tham gia khóa luận.'
};

export enum IsGraduate {
  FALSE = 1,
  TRUE
}

export const StudentColumn = {
  STUDENT_ID: 'student_id',
  SCHOOL_YEAR: 'school_year',
  STUDENT_CLASS: 'student_class',
  IS_GRADUATE: 'is_graduate'
};

export enum StudentSearchType {
  STUDENT_ID = '1',
  FULL_NAME = '2',
  SCHOOL_YEAR = '3',
  STUDENT_CLASS = '4'
}

export const StudentPath = {
  ROOT: 'students',
  SPECIFY: '/:id',
  ADMIN_ROOT: 'admin/students',
  SEARCH_ATTENDEES: '/action/search-thesis-attendees'
};

export const StudentBodyProps = {
  USER: 'user',
  STUDENT: 'student'
};
