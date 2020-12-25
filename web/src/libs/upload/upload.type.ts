import { CommonResponse, FileInfo } from '../common/common.type';

export interface GetFilesResponse extends CommonResponse {
  files: FileInfo[];
}

export interface UseReports {
  data?: GetFilesResponse;
  isLoading: boolean;
}

export interface ExtraRequestBody {
  name: string;
  value: string | Blob;
}

export interface UseResults {
  data?: GetFilesResponse;
  isLoading: boolean;
}

export type UploadFilesResponse = GetFilesResponse;
