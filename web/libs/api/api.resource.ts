export interface BaseResponse {
  statusCode: number;
}

export interface ErrorResponse extends BaseResponse {
  error: string;
  message: string;
}
