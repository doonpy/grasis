import { TableOptions } from 'sequelize-typescript';

export const COMMON_TABLE_OPTIONS: TableOptions = {
  timestamps: true,
  paranoid: true,
  charset: 'utf8mb4',
};
export const COMMON_MODEL_RESOURCE = {
  FIELD_NAME: {
    ID: 'id',
    CREATE_AT: 'createdAt',
    UPDATE_AT: 'updatedAt',
    DELETE_AT: 'deletedAt',
  },
};
export const COMMON_QUERIES_VALUE = {
  OFFSET: 0,
  LIMIT: 20,
};
export const COMMON_QUERIES = {
  OFFSET: 'offset',
  LIMIT: 'limit',
};
export const COMMON_PARAMS = {
  ID: 'id',
};

export enum Gender {
  MALE = 0,
  FEMALE = 1,
}
export enum UserStatus {
  INACTIVE = 0,
  ACTIVE = 1,
}
