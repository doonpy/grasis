export const STUDENT_ADMIN_PATH_ROOT = '/admin/student';
export const STUDENT_PATH = {
  CREATE: `${STUDENT_ADMIN_PATH_ROOT}/create`
};

export enum StudentApi {
  ROOT = '/students',
  ADMIN = '/admin/students',
  SEARCH_ATTENDEES = 'admin/students/action/search-thesis-attendees'
}

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
