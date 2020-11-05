export const THESIS_PATH_ROOT = '/thesis';

export const ThesisPath = {
  SPECIFY: `${THESIS_PATH_ROOT}/@0`,
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
  GET_MANY: `${THESIS_API_ROOT}?offset=@0&keyword=@1`,
  GET_THESIS_STUDENTS: `${THESIS_API_ROOT}/@0/thesis-students?offset=@1&keyword=@2`,
  GET_THESIS_LECTURERS: `${THESIS_API_ROOT}/@0/thesis-lecturers?offset=@1&keyword=@2`,
  SPECIFY: `${THESIS_API_ROOT}/@0`
};

export enum ThesisAttendeeTarget {
  LECTURER = 1,
  STUDENT
}

export enum LoadMoreTarget {
  STUDENT = 1,
  LECTURER
}
