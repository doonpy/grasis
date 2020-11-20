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

export const DOWNLOAD_TIME_TO_LIVE = 60 * 1000 * 10;

export enum ReportModule {
  PROGRESS_REPORT = 1,
  REVIEW,
  DEFENSE
}

export const FILENAME_PATTERN = new RegExp(/^[^/\\]+$/);

export enum ResultModule {
  REVIEW = 1,
  DEFENSE
}

export const FAILED_ID = 0;
