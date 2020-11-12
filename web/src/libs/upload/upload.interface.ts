import { CommonResponse, FileInfo } from '../common/common.interface';

export interface GetReportsResponse extends CommonResponse {
  reports: FileInfo[];
}

export interface UseReports {
  data?: GetReportsResponse;
  isLoading: boolean;
}
