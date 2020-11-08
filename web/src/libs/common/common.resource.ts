export const COOKIES = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  REMEMBER_ME: 'remember_me'
};

export const SIDER_KEYS = {
  THESIS: '0',
  TOPIC: '1',
  REGISTER_TOPIC: '2',
  PROGRESS_REPORT: '3',
  REVIEW: '4',
  DEFENSE: '5',
  ADMIN_LECTURER: '6',
  ADMIN_STUDENT: '7'
};

export const COMMON_PATH = {
  INDEX: '/',
  LOGIN: '/login',
  REFRESH_TOKEN: '/refresh',
  ERROR: {
    ERR_403: '/error/403',
    ERR_500: '/error/500'
  }
};

export const DEFAULT_PAGE_SIZE = 20;

export const CommonApi = {
  DOWNLOAD: '/download?path=@0',
  UPLOAD_REPORT: '/upload/report',
  DELETE_REPORT: '/upload/delete-report'
};

export const DOWNLOAD_TIME_TO_LIVE = 60 * 1000 * 10;

export enum UploadReportModule {
  PROGRESS_REPORT = 1,
  REVIEW,
  DEFENSE
}

export const UploadReportMimeType = {
  PDF: 'application/pdf',
  WORD: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
};

export const UploadBody = {
  TOPIC_ID: 'topicId',
  MODULE: 'module',
  FILES: 'files'
};

export const UPLOAD_REPORT_LIMIT_FILES = 3;

export const FILENAME_PATTERN = new RegExp(/^[a-zA-Z0-9.\s\-_()]+$/);
