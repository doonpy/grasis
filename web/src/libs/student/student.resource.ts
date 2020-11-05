export const STUDENT_ADMIN_PATH_ROOT = '/student/admin';
export const STUDENT_PATH_ROOT = '/student';
export const StudentPath = {
  CREATE: `${STUDENT_ADMIN_PATH_ROOT}/create`,
  SPECIFY: `${STUDENT_PATH_ROOT}/@0`
};

export const STUDENT_API_ROOT = '/students';

export const STUDENT_API_ADMIN_ROOT = '/admin/students';

export const StudentApi = {
  ADMIN_SPECIFY: `${STUDENT_API_ADMIN_ROOT}/@0`,
  ADMIN_GET_MANY: `${STUDENT_API_ADMIN_ROOT}?offset=@0&keyword=@1`,
  SPECIFY: `${STUDENT_API_ROOT}/@0`,
  SEARCH_ATTENDEES: 'admin/students/action/search-thesis-attendees'
};

export enum IsGraduate {
  FALSE = 1,
  TRUE
}

export enum StudentSearchType {
  STUDENT_ID = '1',
  FULL_NAME = '2',
  SCHOOL_YEAR = '3',
  STUDENT_CLASS = '4'
}

export const IsGraduateText = ['', 'Chưa tốt nghiệp', 'Đã tốt nghiệp'];

export const IsGraduateColor = ['', 'red', 'green'];
