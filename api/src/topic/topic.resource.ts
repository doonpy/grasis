export const TOPIC_TABLE = 'topic';

export const TopicColumn = {
  THESIS_ID: 'thesis_id',
  CREATOR_ID: 'creator_id',
  SUBJECT: 'subject',
  DESCRIPTION: 'description',
  STATUS: 'status',
  APPROVER_ID: 'approver_id',
  MAX_STUDENT: 'max_student',
  CURRENT_STUDENT: 'current_student',
  REGISTER_STATUS: 'register_status'
};

export enum TopicRegisterStatus {
  DISABLE = 1,
  ENABLE
}

export const TopicPath = {
  ROOT: 'topics',
  ADMIN_ROOT: 'admin/topics',
  SPECIFY: ':id',
  CHANGE_STATUS: ':id/change-status',
  CHANGE_REGISTER_STATUS: ':id/change-register-status',
  REGISTER_TOPIC: ':id/students/:studentId/register-topic',
  CHANGE_STUDENT_REGISTER_STATUS: ':id/students/:studentId/change-register-topic-status',
  GET_REVIEW: ':id/review',
  GET_STUDENTS: ':id/students',
  GET_STATES: ':id/states',
  GET_RESULTS: ':id/results'
};

export const TopicError = {
  ERR_1: 'Khóa luận đang ngưng hoạt động.',
  ERR_2: 'Hiện tại không nằm trong thời hạn giảng viên đăng ký đề tài.',
  ERR_3: 'Người phê duyệt đề tài phải là trưởng ngành.',
  ERR_4: 'Người phê duyệt đề tài không tồn tại.',
  ERR_5: 'Đề tài không tồn tại.',
  ERR_6: 'Bạn không có quyền tương tác với đề tài này.',
  ERR_7: 'Trạng thái phê duyệt không hợp lệ.',
  ERR_8: 'Đề tài này chưa được chấp nhận.',
  ERR_9: 'Đề tài này đã đủ số lượng sinh viên tham gia thực hiện.',
  ERR_10: 'Bạn đã đăng ký đề tài này rồi.',
  ERR_11: 'Hiện tại không nằm trong thời hạn sinh viên đăng ký đề tài.',
  ERR_12: 'Sinh viên chưa đăng ký đề tài này.',
  ERR_13: 'Đề tài này hiện không mở đăng ký.',
  ERR_14: 'Bạn không có quyền thực hiện thao tác này.',
  ERR_15: 'Sinh viên đã đăng ký đề tài khác.',
  ERR_16: 'Đề tài này đã đủ sinh viên thực hiện.',
  ERR_17: 'Không thể chỉnh sửa đề tài đã được phê duyệt.',
  ERR_18: 'Không thể xóa đề tài đã được phê duyệt.'
};

export const TopicQuery = {
  THESIS_ID: 'thesisId',
  STUDENT_ID: 'studentId'
};

export enum StateResult {
  NOT_DECIDED = 1,
  PASSED,
  FAILED
}

export const TopicStateBaseColumn = {
  TIME: 'time',
  PLACE: 'place',
  NOTE: 'note'
};
