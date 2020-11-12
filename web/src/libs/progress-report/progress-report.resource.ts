import { ProgressReportTerminology } from '../../assets/terminology/progress-report.terminology';

const PROGRESS_REPORT_API_ROOT = 'progress-reports';

const PROGRESS_REPORT_ADMIN_API_ROOT = 'admin/progress-reports';

export const ProgressReportApi = {
  GET_BY_TOPIC_ID: `${PROGRESS_REPORT_API_ROOT}/with-topic?topicId=@0`,
  ADMIN_SPECIFY: `${PROGRESS_REPORT_ADMIN_API_ROOT}/@0?topicId=@1`,
  ADMIN_CHANGE_RESULT: `${PROGRESS_REPORT_ADMIN_API_ROOT}/@0/change-result?topicId=@1`
};

export enum IsPassed {
  NOT_DECIDED = 1,
  TRUE,
  FALSE
}

export const IsPassedText = [
  '',
  ProgressReportTerminology.PR_15,
  ProgressReportTerminology.PR_13,
  ProgressReportTerminology.PR_14
];

export const IsPassedColor = ['', 'gray', 'green', 'red'];
