import { CommonResponse, FileInfo } from '../common/common.type';

export interface GetFilesReponse extends CommonResponse {
  files: FileInfo[];
}

export interface UseReports {
  data?: GetFilesReponse;
  isLoading: boolean;
}

export interface ExtraRequestBody {
  name: string;
  value: string | Blob;
}

export interface UseResults {
  data?: GetFilesReponse;
  isLoading: boolean;
}
