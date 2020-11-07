const PROGRESS_REPORT_API_ROOT = '/progress-reports';

const PROGRESS_REPORT_ADMIN_API_ROOT = 'admin/progress-reports';

export const ProgressReportApi = {
  GET_BY_TOPIC_ID: `${PROGRESS_REPORT_API_ROOT}/with-topic?topicId=@0`,
  GET_DOCUMENT: `${PROGRESS_REPORT_API_ROOT}/doc?topicId=@0&filename=@1`,
  ADMIN_SPECIFY: `${PROGRESS_REPORT_ADMIN_API_ROOT}/@0?topicId=@1`
};
