import { ProgressReportTerminology } from '../../assets/terminology/progress-report.terminology';

const PROGRESS_REPORT_API_ROOT = 'progress-reports';

const PROGRESS_REPORT_ADMIN_API_ROOT = 'admin/progress-reports';

export const ProgressReportApi = {
  SPECIFY: `${PROGRESS_REPORT_API_ROOT}/@0`,
  ADMIN_SPECIFY: `${PROGRESS_REPORT_ADMIN_API_ROOT}/@0`,
  ADMIN_CHANGE_RESULT: `${PROGRESS_REPORT_ADMIN_API_ROOT}/@0/change-result`,
  GET_RESULT: `${PROGRESS_REPORT_API_ROOT}/@0/result`
};

export const ProgressReportResultText = [
  '',
  ProgressReportTerminology.PR_15,
  ProgressReportTerminology.PR_13,
  ProgressReportTerminology.PR_14
];
