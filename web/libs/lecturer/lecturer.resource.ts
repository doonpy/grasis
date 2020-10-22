export const LECTURER_ADMIN_PATH_ROOT = '/admin/lecturer';
export const LECTURER_PATH = {
  CREATE: `${LECTURER_ADMIN_PATH_ROOT}/create`
};

export enum LecturerApi {
  ROOT = '/lecturers',
  ADMIN = '/admin/lecturers',
  SEARCH_ATTENDEES = `admin/lecturers/action/search-thesis-attendees`
}

export enum LecturerSearchType {
  LECTURER_ID = '1',
  FULL_NAME = '2'
}
