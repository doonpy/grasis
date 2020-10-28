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

export enum TopicStatus {
  NEW = 1,
  PENDING,
  APPROVED,
  REJECTED,
  CANCELED
}

export enum RegisterStatus {
  DISABLE = 1,
  ENABLE
}

export const TopicPath = {
  ROOT: 'topics',
  SPECIFY: '/:id',
  ADMIN_ROOT: 'admin/topics'
};

export const TopicError = {
  ERR_1: 'Khóa luận đang ngưng hoạt động.',
  ERR_2: 'Hiện tại không nằm trong thời hạn giảng viên đăng ký đề tài.',
  ERR_3: 'Người phê duyệt đề tài phải là trưởng ngành.',
  ERR_4: 'Người phê duyệt đề tài không tồn tại.'
};
