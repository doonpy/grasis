import { Moment } from 'moment';

import { CommonColumns, CommonResponse } from '../common/common.type';
import { StudentForFastView } from '../student/student.type';
import { StateResult } from '../topic/topic-state/topic-state.resource';

export interface ProgressReport extends CommonColumns {
  id: number;
  time: string | Moment;
  place: string | null;
  note: string | null;
  result: StateResult;
}

export type ProgressReportRequestBody = WithOptional<
  Omit<ProgressReport, keyof CommonColumns | 'id'>,
  'note' | 'place'
>;

export interface ProgressReportGetByIdResponse extends CommonResponse {
  progressReport: ProgressReportForView;
}

export type ProgressReportForView = Omit<ProgressReport, 'deletedAt'> & {
  reporters: StudentForFastView[];
};

export interface UseProgressReport {
  isLoading: boolean;
  data?: ProgressReportGetByIdResponse;
}

export type ProgressReportUpdateResponse = ProgressReportGetByIdResponse;

export type ProgressReportChangeResultResponse = ProgressReportGetByIdResponse;

export type ProgressReportGetResultResponse = CommonResponse & Pick<ProgressReport, 'result'>;

export interface UseProgressReportResult {
  isLoading: boolean;
  data?: ProgressReportGetResultResponse;
}
