export const LECTURER_TABLE = 'lecturer';

export enum LecturerError {
  ERR_1 = 'Mã giảng viên không tồn tại.',
  ERR_2 = 'Mã giảng viên đã tồn tại.',
  ERR_3 = 'Giảng viên không tồn tại.'
}

export const LECTURER_LEVELS = ['Tiến sĩ', 'Thạc sĩ', 'Phó giáo sư', 'Giáo sư'];

export enum LecturerSearchType {
  LECTURER_ID = '1',
  FULL_NAME = '2'
}

export enum LecturerColumn {
  LECTURER_ID = 'lecturer_id',
  POSITION = 'position',
  LEVEL = 'level'
}

export enum LecturerPath {
  ROOT = 'lecturers',
  SPECIFY = '/:id',
  ADMIN_ROOT = 'admin/lecturers',
  SEARCH_ATTENDEES = '/action/search-thesis-attendees'
}

export enum LecturerRelation {
  USER = 'user',
  THESES = 'theses'
}

export enum LecturerBodyProps {
  USER = 'user',
  LECTURER = 'lecturer'
}
