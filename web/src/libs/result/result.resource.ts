export enum ResultType {
  INSTRUCTOR = 1,
  REVIEW,
  DEFENSE
}

export enum ResultStatus {
  UNLOCK = 1,
  LOCK
}

const RESULT_API_ROOT = 'results';

const RESULT_ADMIN_API_ROOT = 'admin/results';

export const ResultApi = {
  SPECIFY: `${RESULT_API_ROOT}/@0`,
  ADMIN_SPECIFY: `${RESULT_ADMIN_API_ROOT}/@0`,
  ADMIN_CHANGE_RESULT: `${RESULT_ADMIN_API_ROOT}/@0/change-result`
};

export const ResultPointColor = { RED: '#cf1322', GREEN: '#3f8600' };
