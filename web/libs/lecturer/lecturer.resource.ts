export const LECTURER_ADMIN_PATH_ROOT = '/lecturer/admin';
export const LECTURER_PATH_ROOT = '/lecturer';
export const LECTURER_PATH = {
  CREATE: `${LECTURER_ADMIN_PATH_ROOT}/create`
};

export const LECTURER_API_ROOT = '/lecturers';

export const LECTURER_API_ADMIN_ROOT = '/admin/lecturers';

export const LecturerApi = {
  ADMIN_GET_MANY: `${LECTURER_API_ADMIN_ROOT}?offset=@0&keyword=@1`,
  ADMIN_SPECIFY: `${LECTURER_API_ADMIN_ROOT}/@0`,
  SPECIFY: `${LECTURER_API_ROOT}/@0`,
  SEARCH_ATTENDEES: `admin/lecturers/action/search-thesis-attendees`
};

export enum LecturerSearchType {
  LECTURER_ID = '1',
  FULL_NAME = '2'
}
