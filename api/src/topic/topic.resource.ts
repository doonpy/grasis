export const TOPIC_TABLE = 'topic';

export const TopicColumn = {
  THESIS_ID: 'thesis_id',
  CREATOR_ID: 'creator_id',
  SUBJECT: 'subject',
  DESCRIPTION: 'description',
  STATUS: 'status',
  APPROVER_ID: 'approver_id',
  MAX_STUDENT: 'max_student',
  REGISTER_STATUS: 'register_status'
};

export enum TopicRegisterStatus {
  DISABLE = 1,
  ENABLE
}

export const TopicPath = {
  ROOT: ':thesisId/topics',
  ADMIN_ROOT: 'admin/topics',
  WITH_THESIS: '/:thesisId',
  SPECIFY: ':id',
  CHANGE_STATUS: ':id/change-status',
  CHANGE_REGISTER_STATUS: ':id/change-register-status'
};

export const TopicError = {
  ERR_1: 'Khóa luận đang ngưng hoạt động.',
  ERR_2: 'Hiện tại không nằm trong thời hạn giảng viên đăng ký đề tài.',
  ERR_3: 'Người phê duyệt đề tài phải là trưởng ngành.',
  ERR_4: 'Người phê duyệt đề tài không tồn tại.',
  ERR_5: 'Đề tài không tồn tại.',
  ERR_6: 'Bạn không có quyền tương tác với đề tài này.',
  ERR_7: 'Trạng thái phê duyệt không hợp lệ.',
  ERR_8: 'Đề tài này chưa được chấp nhận.'
};

export const TopicParam = {
  THESIS_ID: 'thesisId'
};
