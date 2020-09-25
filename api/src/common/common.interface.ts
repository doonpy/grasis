export interface CommonResponse {
  statusCode: number;
}

export interface CommonFindAllResponse extends CommonResponse {
  isNext: boolean;
}
