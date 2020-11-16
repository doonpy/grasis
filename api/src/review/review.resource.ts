export const REVIEW_TABLE = 'review';

export const ReviewColumn = {
  RESULT: 'result',
  REVIEWER_ID: ' reviewer_id'
};

export const ReviewError = {
  ERR_1: 'Đã tồn tại báo cáo tiến độ cho đề tài này.',
  ERR_2: 'Phản biện không tồn tại.',
  ERR_3: 'Thời gian báo cáo tiến độ không hợp lệ.',
  ERR_4: 'Bạn không phải sinh viên thực hiện đề tài này.',
  ERR_5: 'Khóa luận đang ngưng hoạt động.',
  ERR_6: 'Hiện tại không phải thời gian phản biện.',
  ERR_7: 'Bạn không phải người phản biện đề tài này.',
  ERR_8: 'Không thể chỉnh sửa tài liệu phản biện đã có kết quả.'
};

export const ReviewPath = {
  ROOT: 'reviews',
  ADMIN_ROOT: 'admin/reviews',
  SPECIFY: ':id',
  CHANGE_RESULT: ':id/change-result'
};
