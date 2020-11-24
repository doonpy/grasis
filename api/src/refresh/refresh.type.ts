import { RefreshEntity } from './refresh.entity';

export type Refresh = RefreshEntity;

export type CreateRefresh = Omit<Refresh, 'id' | 'updatedAt' | 'deletedAt' | 'createdAt'>;
