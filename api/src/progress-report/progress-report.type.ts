import { CommonColumns, CommonResponse } from '../common/common.type';
import { StudentForFastView } from '../student/student.type';
import { ProgressReportEntity } from './progress-report.entity';

export type ProgressReport = ProgressReportEntity;

export type ProgressReportRequestBody = WithOptional<
  Omit<ProgressReport, keyof CommonColumns | 'id' | 'topic' | 'topicId' | 'isPassed' | 'comments'>,
  'note' | 'place'
>;

export interface ProgressReportCreateOrUpdateResponse extends CommonResponse {
  id: number;
}

export interface ProgressReportGetByIdResponse extends CommonResponse {
  progressReport: ProgressReportForView;
}

export type ProgressReportForView = Omit<ProgressReport, 'deletedAt' | 'topic'> & {
  reporters: StudentForFastView[];
};
