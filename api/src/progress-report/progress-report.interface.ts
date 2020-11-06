import { CommonColumns, CommonResponse } from '../common/common.interface';
import { StudentForFastView } from '../student/student.interface';
import { ProgressReportEntity } from './progress-report.entity';

export type ProgressReport = ProgressReportEntity;

export type ProgressReportRequestBody = WithOptional<
  Omit<ProgressReport, keyof CommonColumns | 'id' | 'topic' | 'topicId'>,
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
