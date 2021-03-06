export const THESIS_TABLE = 'thesis';

export const ThesisColumn = {
  SUBJECT: 'subject',
  CREATOR_ID: 'creator_id',
  START_TIME: 'start_time',
  END_TIME: 'end_time',
  STATE: 'state',
  LECTURER_TOPIC_REGISTER: 'lecturer_topic_register',
  STUDENT_TOPIC_REGISTER: 'student_topic_register',
  PROGRESS_REPORT: 'progress_report',
  REVIEW: 'review',
  DEFENSE: 'defense',
  STATUS: 'status'
};

export const THESIS_ADMIN_ROOT_PATH = 'admin/theses';

export const THESIS_ROOT_PATH = 'theses';

export const ThesisPath = {
  SPECIFY: '/:id',
  ADMIN_EDIT: '/:id/edit',
  ADMIN_SWITCH_STATUS: '/:id/switch-status',
  GET_THESIS_STUDENTS: '/:id/thesis-students',
  GET_THESIS_LECTURERS: '/:id/thesis-lecturers',
  SEARCH_THESIS_LECTURERS: '/:id/thesis-lecturers/search'
};

export const ThesisError = {
  ERR_1: 'Thời gian đăng ký đề tài của giảng viên không hợp lệ.',
  ERR_2: 'Thời gian đăng ký đề tài của sinh viên không hợp lệ.',
  ERR_3: 'Thời gian báo cáo tiến độ không hợp lệ.',
  ERR_4: 'Thời gian phản biện không hợp lệ.',
  ERR_5: 'Thời gian bảo vệ không hợp lệ.',
  ERR_6: 'Thời gian bắt đầu và kết thúc khóa luận không hợp lệ.',
  ERR_7: 'Khóa luận không tồn tại.',
  ERR_8: 'Bạn không có quyền tương tác với khóa luận này.',
  ERR_9: 'Khóa luận đang ngưng hoạt động.',
  ERR_10: 'Khóa luận đang hoạt động.'
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

export enum ThesisStatus {
  INACTIVE = 1,
  ACTIVE = 2
}
