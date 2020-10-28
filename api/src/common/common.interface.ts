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
