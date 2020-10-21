export const THESIS_TABLE = 'thesis';

export enum THESIS_COLUMN {
  CREATOR = 'creator',
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

export enum THESIS_PATH {
  ROOT = 'thesis',
  SPECIFY = '/:id',
  ADMIN_ROOT = 'admin/thesis'
}

export enum THESIS_ERROR {
  ERR_1 = 'Thời gian đăng ký đề tài của giảng viên không hợp lệ.',
  ERR_2 = 'Thời gian đăng ký đề tài của sinh viên không hợp lệ.',
  ERR_3 = 'Thời gian báo cáo tiến độ không hợp lệ.',
  ERR_4 = 'Thời gian phản biện không hợp lệ.',
  ERR_5 = 'Thời gian bảo vệ không hợp lệ.',
  ERR_6 = 'Thời gian bắt đầu và kết thúc khóa luận không hợp lệ.',
  ERR_7 = 'Khóa luận không tồn tại.'
}

export enum THESIS_STATE {
  LECTURER_TOPIC_REGISTER = 1,
  STUDENT_TOPIC_REGISTER = 2,
  PROGRESS_REPORT = 3,
  REVIEW = 4,
  DEFENSE = 5,
  FINISH = 6
}

export enum THESIS_STATUS {
  INACTIVE = 1,
  ACTIVE = 2
}
