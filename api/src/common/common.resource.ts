import { TableOptions } from 'sequelize-typescript';

export const COMMON_TABLE_OPTIONS: TableOptions = {
  timestamps: true,
  charset: 'utf8mb4',
};
export const COMMON_MODEL_RESOURCE = {
  FIELD_NAME: {
    ID: 'id',
    CREATED_AT: 'createdAt',
    UPDATED_AT: 'updatedAt',
    DELETED_AT: 'deletedAt',
  },
};
export const COMMON_SELECT_ATTRIBUTES = [
  COMMON_MODEL_RESOURCE.FIELD_NAME.ID,
  COMMON_MODEL_RESOURCE.FIELD_NAME.CREATED_AT,
  COMMON_MODEL_RESOURCE.FIELD_NAME.UPDATED_AT,
];
export const COMMON_QUERIES_VALUE = {
  OFFSET: 0,
  LIMIT: 20,
  FAILED_ID: 0,
};
export const COMMON_QUERIES = {
  OFFSET: 'offset',
  LIMIT: 'limit',
};
export const COMMON_PARAMS = {
  ID: 'id',
};
