// This file declare global type (for customization)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Details } from 'express-useragent';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface IncomingHttpHeaders {}

  namespace Express {
    interface User {
      userId: number;
      iat: number;
      exp: number;
    }

    interface CustomRequest {
      headers: IncomingHttpHeaders & {
        refresh?: string;
      };
      params?: Record<string, any>;
      body?: Record<string, any>;
      user?: User;
      useragent?: Details;
      query?: Record<string, any>;
      fileCount?: number;
    }
  }

  type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
}

export {};
