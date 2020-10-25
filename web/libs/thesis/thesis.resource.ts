export const THESIS_PATH_ROOT = '/thesis';

export const THESIS_PATH = {
  CREATE: `${THESIS_PATH_ROOT}/admin/create`,
  EDIT: `${THESIS_PATH_ROOT}/admin/%id/edit`
};

export enum ThesisState {
  LECTURER_TOPIC_REGISTER = 1,
  STUDENT_TOPIC_REGISTER = 2,
  PROGRESS_REPORT = 3,
  REVIEW = 4,
  DEFENSE = 5,
  FINISH = 6
}

export const ThesisStateTexts = [
  '',
  'Giảng viên đăng ký đề tài',
  'Sinh viên đăng ký đề tài',
  'Báo cáo tiến độ',
  'Phản biện',
  'Bảo vệ',
  'Kết thúc'
];

export enum ThesisStatus {
  INACTIVE = 1,
  ACTIVE = 2
}

export enum ThesisApi {
  ROOT = '/theses',
  ADMIN = '/admin/theses',
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
