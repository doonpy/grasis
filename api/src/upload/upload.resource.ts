export const UPLOAD_ROOT_FOLDER = `./upload`;

export const UploadPath = {
  ROOT: 'upload',
  AVATAR: '/avatar',
  REPORT: '/report',
  DELETE_REPORT: '/delete-report',
  RESULT: '/result',
  DELETE_RESULT: '/delete-result'
};

export const UPLOAD_REPORT_BODY_PROPERTY = 'files';

export const UPLOAD_RESULT_BODY_PROPERTY = 'file';

export const UploadDestination = {
  AVATAR: `${UPLOAD_ROOT_FOLDER}/avatar`,
  REPORT_ROOT: 'report',
  PROGRESS_REPORT: 'progress-report',
  REVIEW: 'review',
  REVIEW_RESULT: 'result'
};

export const UploadFileSize = {
  AVATAR: 2097152,
  REPORT: 20000000
};

export const UploadReportMimeTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
];

export const UploadResultMimeTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export const UPLOAD_REPORT_LIMIT_FILES = 2;

export const UPLOAD_RESULT_LIMIT_FILES = 1;

export const UploadBody = {
  TOPIC_ID: 'topicId',
  MODULE: 'module',
  FILENAME: 'filename'
};

export const UploadError = {
  ERR_1: 'Định dạng tệp tin không hợp lệ.',
  ERR_2: 'Thư mục không tồn tại.',
  ERR_3: 'Tệp tin không tồn tại.',
  ERR_4: 'Module báo cáo không hợp lệ.',
  ERR_5: 'Tên tệp tin không hợp lệ.',
  ERR_6: 'Số lượng tệp tin tải lên vượt quá mức cho phép.',
  ERR_7: `Số lượng tài liệu báo cáo không vượt quá ${UPLOAD_REPORT_LIMIT_FILES}.`,
  ERR_8: 'Dung lượng tệp quá lớn.',
  ERR_9: `Số lượng tài liệu kết quả không vượt quá ${UPLOAD_RESULT_LIMIT_FILES}.`
};
