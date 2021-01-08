export const REVIEW_TABLE = 'review';

export const ReviewColumn = {
  RESULT: 'result',
  REVIEWER_ID: 'reviewer_id',
  REVIEWER_COMMENT: 'reviewer_comment'
};

export const ReviewError = {
  ERR_1: 'Đã tồn tại phản biện cho đề tài này.',
  ERR_2: 'Phản biện không tồn tại.',
  ERR_3: 'Thời gian phản biện không hợp lệ.',
  ERR_4: 'Bạn không phải sinh viên thực hiện đề tài này.',
  ERR_5: 'Khóa luận đang ngưng hoạt động.',
  ERR_6: 'Hiện tại không phải thời gian phản biện.',
  ERR_7: 'Bạn không phải người phản biện đề tài này.',
  ERR_8: 'Không thể chỉnh sửa tài liệu phản biện đã có kết quả.',
  ERR_9: 'Phản biện này đã có kết quả.',
  ERR_10: 'Phản biện này chưa có kết quả hoặc có kết quả thất bại.',
  ERR_11: 'Bạn không có quyền thay đổi người phản biện đề tài này.'
};

export const ReviewPath = {
  ROOT: 'reviews',
  ADMIN_ROOT: 'admin/reviews',
  SPECIFY: ':id',
  CHANGE_RESULT: ':id/change-result',
  GET_RESULT: ':id/result'
};
