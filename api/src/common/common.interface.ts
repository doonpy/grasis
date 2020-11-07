export interface CommonResponse {
  statusCode: number;
}

export interface CommonFindManyResponse extends CommonResponse {
  total: number;
}

export interface CommonColumns {
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface FileInfo {
  name: string;
  size: number;
  ctime: Date;
  mtime: Date;
}

export interface GenerateDownloadLinkResponse {
  url: string;
}
