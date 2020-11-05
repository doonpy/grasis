export const LECTURER_TABLE = 'lecturer';

export const LecturerError = {
  ERR_1: 'Mã giảng viên không tồn tại.',
  ERR_2: 'Mã giảng viên đã tồn tại.',
  ERR_3: 'Giảng viên không tồn tại.',
  ERR_4: 'Giảng viên đang tham gia một khóa luận.',
  ERR_5: 'Giảng viên đang là quản trị viên của một khóa luận đang diễn ra.'
};

export const LECTURER_LEVELS = ['Tiến sĩ', 'Thạc sĩ', 'Phó giáo sư', 'Giáo sư'];

export enum LecturerSearchType {
  LECTURER_ID = '1',
  FULL_NAME = '2'
}

export const LecturerColumn = {
  LECTURER_ID: 'lecturer_id',
  POSITION: 'position',
  LEVEL: 'level'
};

export const LecturerPath = {
  ROOT: 'lecturers',
  SPECIFY: '/:id',
  ADMIN_ROOT: 'admin/lecturers',
  SEARCH_ATTENDEES: '/action/search-thesis-attendees'
};

export const LecturerBodyProps = {
  USER: 'user',
  LECTURER: 'lecturer'
};
