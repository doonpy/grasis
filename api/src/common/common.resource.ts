import { EntityOptions } from 'typeorm';

export const COMMON_QUERIES_VALUE = {
  OFFSET: 0,
  LIMIT: 20,
  FAILED_ID: 0
};
export const COMMON_QUERIES = {
  OFFSET: 'offset',
  LIMIT: 'limit'
};
export const COMMON_PARAMS = {
  ID: 'id'
};
export const COMMON_ENTITY_OPTIONS: EntityOptions = {
  database: process.env.DB_MSSQL_DATABASE,
  engine: 'InnoDB'
};
