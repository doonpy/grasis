import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ColumnOptions, EntityOptions, IsNull } from 'typeorm';

export const CommonQueryValue = {
  OFFSET: 0,
  LIMIT: 20,
  FAILED_ID: 0
};

export const CommonQuery = {
  OFFSET: 'offset',
  LIMIT: 'limit',
  KEYWORD: 'keyword',
  SEARCH_TYPES: 'searchTypes',
  DOWNLOAD_PATH: '/path'
};

export const CommonParam = {
  ID: 'id'
};

export const COMMON_ENTITY_OPTIONS: EntityOptions = {
  database: process.env.DB_MSSQL_DATABASE,
  engine: 'InnoDB'
};

export const DatabaseType = {
  STAGING: 'staging',
  PRODUCTION: 'production'
};

export const EnvFileName = {
  LOCAL: 'local.env',
  STAGING: 'staging.env',
  PRODUCTION: 'production.env'
};

export const CORS_OPTIONS: CorsOptions = {
  origin: /^https:\/\/grasis.*\.herokuapp.com$/,
  optionsSuccessStatus: 200
};

export const CommonPath = {
  LOGIN: '/login',
  REFRESH_TOKEN: '/refresh',
  DOWNLOAD: '/download'
};

export const CommonColumn = {
  ID: 'id',
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at',
  DELETED_AT: 'deleted_at'
};

export const notDeleteCondition = {
  deletedAt: IsNull()
};

export const commonStringColumnOptions: ColumnOptions = {
  charset: 'utf8mb4',
  collation: 'utf8mb4_general_ci'
};
