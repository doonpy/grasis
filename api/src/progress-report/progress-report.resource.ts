export const PROGRESS_REPORT_TABLE = 'progress_report';

export const ProgressReportColumn = {
  TOPIC_ID: 'topic_id',
  TIME: 'time',
  PLACE: 'place',
  NOTE: 'note'
};

export const ProgressReportError = {
  ERR_1: 'Đã tồn tại báo cáo tiến độ cho đề tài này.',
  ERR_2: 'Báo cáo tiến độ không tồn tại.',
  ERR_3: 'Thời gian báo cáo tiến độ không hợp lệ.'
};

export const ProgressReportPath = {
  ROOT: 'progress-reports',
  ADMIN_ROOT: 'admin/progress-reports',
  SPECIFY: '/:id',
  GET_BY_TOPIC_ID: '/with-topic'
};

export const ProgressReportQuery = {
  TOPIC_ID: 'topicId',
  THESIS_ID: 'thesisId'
};
