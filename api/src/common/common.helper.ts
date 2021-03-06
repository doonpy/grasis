import { DatabaseType } from './common.resource';

export function isProductionMode(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function isReviewData(): boolean {
  return process.env.DB_TYPE === DatabaseType.REVIEW;
}
