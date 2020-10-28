export const THESIS_PATH_ROOT = '/thesis';

export const THESIS_PATH = {
  CREATE: `${THESIS_PATH_ROOT}/admin/create`,
  EDIT: `${THESIS_PATH_ROOT}/admin/@0/edit`
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

export const THESIS_API_ROOT = '/theses';

export const THESIS_API_ADMIN_ROOT = `/admin/theses`;

export const ThesisApi = {
  ADMIN_GET_EDIT: `${THESIS_API_ADMIN_ROOT}/@0/edit`,
  ADMIN_SPECIFY: `${THESIS_API_ADMIN_ROOT}/@0`,
  ADMIN_SWITCH_STATUS: `${THESIS_API_ADMIN_ROOT}/@0/switch-status`,
  LOAD_MORE_LECTURERS: `${THESIS_API_ROOT}/@0/lecturers-load-more?offset=@1`,
  LOAD_MORE_STUDENTS: `${THESIS_API_ROOT}/@0/students-load-more?offset=@1`,
  GET_MANY: `${THESIS_API_ROOT}?offset=@0&keyword=@1`
};

export enum ThesisAttendeeTarget {
  LECTURER = 1,
  STUDENT
}

export enum LoadMoreTarget {
  STUDENT = 1,
  LECTURER
}