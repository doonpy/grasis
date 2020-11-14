export const UPLOAD_API_ROOT = 'upload';

export const UploadApi = {
  GET_REPORTS: `${UPLOAD_API_ROOT}/report?topicId=@0&module=@1`,
  REPORT: `${UPLOAD_API_ROOT}/report`,
  DELETE_REPORT: `${UPLOAD_API_ROOT}/delete-report`
};

export const UploadReportMimeType = {
  PDF: 'application/pdf',
  MS_WORD: 'application/msword',
  WORD: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  MS_POWERPOINT: 'application/vnd.ms-powerpoint',
  POWERPOINT: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
};

export const UploadReportMimeTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
];

export const UploadBody = {
  TOPIC_ID: 'topicId',
  MODULE: 'module',
  FILES: 'files'
};

export const UPLOAD_REPORT_LIMIT_FILES = 2;
