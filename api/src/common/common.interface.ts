export interface CommonResponse {
  statusCode: number;
}

export interface CommonFindManyResponse extends CommonResponse {
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

export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
