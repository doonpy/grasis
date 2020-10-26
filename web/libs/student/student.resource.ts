export const STUDENT_ADMIN_PATH_ROOT = '/student/admin';
export const STUDENT_PATH_ROOT = '/student';
export const STUDENT_PATH = {
  CREATE: `${STUDENT_ADMIN_PATH_ROOT}/create`
};

export const STUDENT_API_ROOT = '/students';

export const STUDENT_API_ADMIN_ROOT = '/admin/students';

export const StudentApi = {
  ADMIN_SPECIFY: `${STUDENT_API_ADMIN_ROOT}/@0`,
  SPECIFY: `${STUDENT_API_ROOT}/@0`,
  SEARCH_ATTENDEES: 'admin/students/action/search-thesis-attendees'
};

export enum IsGraduate {
  FALSE = 1,
  TRUE = 2
}

export enum StudentSearchType {
  STUDENT_ID = '1',
  FULL_NAME = '2',
  SCHOOL_YEAR = '3',
  STUDENT_CLASS = '4'
}
