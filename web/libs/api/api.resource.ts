export interface BaseResponse {
  statusCode: number;
}

export interface ErrorResponse extends BaseResponse {
  error: string;
  message: string;
}

export interface SuccessLoginResponse {
  accessToken: string;
  refreshToken: string;
}
