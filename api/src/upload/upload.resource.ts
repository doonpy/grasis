import { PROGRESS_REPORT_UPLOAD_FOLDER } from '../progress-report/progress-report.resource';

export const UPLOAD_ROOT_FOLDER = './files';

export const DOWNLOAD_ROOT_FOLDER = './download';

export const UploadPath = {
  ROOT: 'upload',
  AVATAR: '/avatar',
  PROGRESS_REPORT: '/progress-report',
  REPORT: '/report',
  DELETE_REPORT: '/delete-report'
};

export const UPLOAD_REPORT_BODY_PROPERTY = 'files';

export const UploadDestination = {
  AVATAR: `${UPLOAD_ROOT_FOLDER}/avatar`,
  PROGRESS_REPORT: `${UPLOAD_ROOT_FOLDER}/${PROGRESS_REPORT_UPLOAD_FOLDER}`
};

export const UploadFileSize = {
  AVATAR: 2097152,
  REPORT: NaN
};

export enum UploadReportModule {
  PROGRESS_REPORT = 1,
  REVIEW,
  DEFENSE
}

export const UploadReportMimeType = {
  PDF: 'application/pdf',
  WORD: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
};

export const UploadReportExtension = {
  PDF: '.pdf',
  WORD: '.docx'
};

export const UPLOAD_TIME_TO_LIVE = 60 * 1000 * 10;

export const UPLOAD_REPORT_LIMIT_FILES = 3;

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
  ERR_7: `Số lượng tài liệu báo cáo không vượt quá ${UPLOAD_REPORT_LIMIT_FILES}.`
};
