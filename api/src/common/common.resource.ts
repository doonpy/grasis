import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
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

export enum DatabaseType {
  STAGING = 'staging',
  PRODUCTION = 'production'
}

export enum EnvFileName {
  LOCAL = 'local.env',
  STAGING = 'staging.env',
  PRODUCTION = 'production.env'
}

export const CORS_OPTIONS: CorsOptions = {
  origin: /https:\/\/grasis.*\.herokuapp.com/,
  optionsSuccessStatus: 200
};

export const COMMON_PATH = {
  LOGIN: '/login',
  REFRESH_TOKEN: '/refresh'
};

export enum COMMON_COLUMN {
  ID = 'id',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
  DELETED_AT = 'deleted_at'
}
