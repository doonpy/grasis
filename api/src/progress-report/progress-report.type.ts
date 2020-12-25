import { CommonColumns, CommonResponse } from '../common/common.type';
import { StudentForFastView } from '../student/student.type';
import { ProgressReportEntity } from './progress-report.entity';

export type ProgressReport = ProgressReportEntity;

export type ProgressReportRequestBody = WithOptional<
  Omit<ProgressReport, keyof CommonColumns | 'id' | 'topic' | 'topicId' | 'isPassed' | 'result'>,
  'note' | 'place'
>;

export interface ProgressReportGetByIdResponse extends CommonResponse {
  progressReport: ProgressReportForView;
}

export type ProgressReportForView = Omit<ProgressReport, 'deletedAt' | 'topic'> & {
  reporters: StudentForFastView[];
};

export type ProgressReportUpdateResponse = ProgressReportGetByIdResponse;

export type ProgressReportChangeResultResponse = ProgressReportGetByIdResponse;
