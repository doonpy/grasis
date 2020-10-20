export interface CommonResponse {
  statusCode: number;
}

export interface CommonFindAllResponse extends CommonResponse {
  total: number;
}

export interface CommonColumns {
  createdAt: string;
  updatedAt: string;
}

export interface CommonRequest extends Express.Request {
  params?: {
    id?: string;
  };
  body?: Record<string, string>;
}
