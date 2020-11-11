export const PROGRESS_REPORT_TABLE = 'progress_report';

export const ProgressReportColumn = {
  TOPIC_ID: 'topic_id',
  TIME: 'time',
  PLACE: 'place',
  NOTE: 'note',
  IS_PASSED: 'is_passed'
};

export const ProgressReportError = {
  ERR_1: 'Đã tồn tại báo cáo tiến độ cho đề tài này.',
  ERR_2: 'Báo cáo tiến độ không tồn tại.',
  ERR_3: 'Thời gian báo cáo tiến độ không hợp lệ.',
  ERR_4: 'Bạn không phải sinh viên thực hiện đề tài này.',
  ERR_5: 'Khóa luận đang ngưng hoạt động.',
  ERR_6: 'Hiện tại không phải thời gian báo cáo tiến độ.'
};

export const ProgressReportPath = {
  ROOT: 'progress-reports',
  ADMIN_ROOT: 'admin/progress-reports',
  SPECIFY: '/:id',
  GET_BY_TOPIC_ID: '/with-topic',
  GET_DOCUMENT: '/doc',
  ADMIN_CHANGE_RESULT: '/:id/change-result',
  COMMENT: '/:id/comments',
  COMMENT_SPECIFY: '/comments/:commentId'
};

export const ProgressReportQuery = {
  TOPIC_ID: 'topicId',
  THESIS_ID: 'thesisId',
  FILE_NAME: 'filename'
};

export const PROGRESS_REPORT_UPLOAD_FOLDER = 'progress-report';

export enum IsPassed {
  NOT_DECIDED = 1,
  TRUE,
  FALSE
}

export const ProgressReportBody = {
  IS_PASSED: 'isPassed'
};
