export const THESIS_PATH_ROOT = '/thesis';

export const THESIS_PATH = {
  CREATE: `${THESIS_PATH_ROOT}/admin/create`,
  EDIT: `${THESIS_PATH_ROOT}/admin/%id/edit`
};

export enum ThesisState {
  NOT_START = 1,
  LECTURER_TOPIC_REGISTER,
  STUDENT_TOPIC_REGISTER,
  PROGRESS_REPORT,
  REVIEW,
  DEFENSE,
  RESULT,
  FINISH
}

export const ThesisStateTexts = [
  '',
  'Chưa bắt đầu',
  'Giảng viên đăng ký đề tài',
  'Sinh viên đăng ký đề tài',
  'Báo cáo tiến độ',
  'Phản biện',
  'Bảo vệ',
  'Công bố kết quả',
  'Kết thúc'
];

export enum ThesisStatus {
  INACTIVE = 1,
  ACTIVE = 2
}

export enum ThesisApi {
  ROOT = '/theses',
  ADMIN = '/admin/theses',
  ADMIN_GET_EDIT = 'admin/theses/@1/edit',
  ADMIN_SPECIFY = 'admin/theses/@1',
  LOAD_MORE_LECTURERS = 'lecturers-load-more',
  LOAD_MORE_STUDENTS = 'students-load-more'
}

export enum ThesisAttendeeTarget {
  LECTURER = 1,
  STUDENT = 2
}

export enum LoadMoreTarget {
  STUDENT,
  LECTURER
}
