export interface Refresh {
  id: number;
  userId: number;
  browser: string;
  version: string;
  platform: string;
  os: string;
  refreshToken: string;
  source: string;
  updatedAt: string;
}

export type CreateRefresh = Omit<Refresh, 'id' | 'updatedAt'>;
export type GetRefresh = Partial<Refresh>;
