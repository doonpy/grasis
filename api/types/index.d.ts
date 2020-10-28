// This file declare global type (for customization)

import { Details } from 'express-useragent';
import { IncomingHttpHeaders } from 'http';

declare global {
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
      params?: {
        id?: string;
      };
      body?: any;
      user?: User;
      useragent?: Details;
    }
  }

  type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
}

export {};
