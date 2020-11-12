import { CommonResponse, FileInfo } from '../common/common.type';

export type FileDestinationCallback = (error: Error | null, destination: string) => void;

export type FileNameCallback = (error: Error | null, destination: string) => void;

export type FileFilterCallback = (error: null | Error, acceptFile: boolean) => void;

export interface GetReportsResponse extends CommonResponse {
  reports: FileInfo[];
}
