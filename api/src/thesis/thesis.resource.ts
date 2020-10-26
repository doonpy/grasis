export const THESIS_TABLE = 'thesis';

export const THESIS_LECTURER_TABLE = `${THESIS_TABLE}_lecturer`;

export enum ThesisColumn {
  SUBJECT = 'subject',
  CREATOR_ID = 'creator_id',
  START_TIME = 'start_time',
  END_TIME = 'end_time',
  STATE = 'state',
  LECTURER_TOPIC_REGISTER = 'lecturer_topic_register',
  STUDENT_TOPIC_REGISTER = 'student_topic_register',
  PROGRESS_REPORT = 'progress_report',
  REVIEW = 'review',
  DEFENSE = 'defense',
  STATUS = 'status'
}

export const THESIS_ADMIN_ROOT_PATH = 'admin/theses';

export const THESIS_ROOT_PATH = 'theses';

export const ThesisPath = {
  SPECIFY: '/:id',
  ADMIN_EDIT: '/:id/edit',
  ADMIN_SWITCH_STATUS: '/:id/switch-status',
  LOAD_MORE_LECTURERS: '/:id/lecturers-load-more',
  LOAD_MORE_STUDENTS: '/:id/students-load-more'
};

export enum ThesisError {
  ERR_1 = 'Thời gian đăng ký đề tài của giảng viên không hợp lệ.',
  ERR_2 = 'Thời gian đăng ký đề tài của sinh viên không hợp lệ.',
  ERR_3 = 'Thời gian báo cáo tiến độ không hợp lệ.',
  ERR_4 = 'Thời gian phản biện không hợp lệ.',
  ERR_5 = 'Thời gian bảo vệ không hợp lệ.',
  ERR_6 = 'Thời gian bắt đầu và kết thúc khóa luận không hợp lệ.',
  ERR_7 = 'Khóa luận không tồn tại.',
  ERR_8 = 'Bạn không có quyền tương tác với khóa luận này.'
}

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

export enum ThesisRelation {
  CREATOR = 'creator',
  STUDENTS = 'students',
  LECTURERS = 'lecturers'
}

export enum ThesisLecturerColumn {
  THESIS_ID = 'thesis_id',
  LECTURER_ID = 'lecturer_id'
}

export const ATTENDEES_LOAD_LIMIT = 10;
