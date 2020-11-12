import { Moment } from 'moment';

import { CommonColumns, CommonResponse } from '../common/common.type';
import { StudentForFastView } from '../student/student.type';
import { Topic } from '../topic/topic.type';
import { IsPassed } from './progress-report.resource';

export interface ProgressReport extends CommonColumns {
  id: number;
  topicId: number;
  time: string | Moment;
  place: string | null;
  note: string | null;
  isPassed: IsPassed;
  topic: Topic;
}

export interface ProgressReportCreateOrUpdateResponse extends CommonResponse {
  id: number;
}

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

export interface UseProgressReport {
  isLoading: boolean;
  data?: ProgressReportGetByIdResponse;
}
