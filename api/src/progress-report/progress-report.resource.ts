export const PROGRESS_REPORT_TABLE = 'progress_report';

export const ProgressReportColumn = {
  RESULT: 'result'
};

export const ProgressReportError = {
  ERR_1: 'Đã tồn tại báo cáo tiến độ cho đề tài này.',
  ERR_2: 'Báo cáo tiến độ không tồn tại.',
  ERR_3: 'Thời gian báo cáo tiến độ không hợp lệ.',
  ERR_4: 'Bạn không phải sinh viên thực hiện đề tài này.',
  ERR_5: 'Khóa luận đang ngưng hoạt động.',
  ERR_6: 'Hiện tại không phải thời gian báo cáo tiến độ.',
  ERR_7: 'Không thể chỉnh sửa tài liệu khi báo cáo tiến độ đã có kết quả.'
};

export const ProgressReportPath = {
  ROOT: 'progress-reports',
  ADMIN_ROOT: 'admin/progress-reports',
  SPECIFY: ':id',
  ADMIN_CHANGE_RESULT: '/:id/change-result'
};

export const ProgressReportBody = {
  RESULT: 'result'
};
