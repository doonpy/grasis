export const UPLOAD_API_ROOT = 'upload';

export const UploadApi = {
  GET_REPORTS: `${UPLOAD_API_ROOT}/report?topicId=@0&module=@1`,
  REPORT: `${UPLOAD_API_ROOT}/report`,
  DELETE_REPORT: `${UPLOAD_API_ROOT}/delete-report`,
  RESULT: `${UPLOAD_API_ROOT}/result`,
  DELETE_RESULT: `${UPLOAD_API_ROOT}/delete-result`,
  GET_RESULTS: `${UPLOAD_API_ROOT}/result?topicId=@0&module=@1`
};

export const UploadMimeType = {
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
  FILES: 'files',
  FILE: 'file'
};

export const UPLOAD_REPORT_LIMIT_FILES = 2;

export const UPLOAD_RESULT_LIMIT_FILES = 1;
