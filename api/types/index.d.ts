// This file declare global type (for customization)

declare global {
  namespace Express {
    interface User {
      userId: number;
      iat: number;
      exp: number;
    }

    interface Request<BodyType = Record<string, any>> {
      params?: {
        id?: string;
      };
      body?: BodyType;
      user?: User;
    }
  }

  type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
}

export {};
