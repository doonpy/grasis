import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ColumnOptions, EntityOptions } from 'typeorm';

export const CommonQueryValue = {
  OFFSET: 0,
  LIMIT: 20,
  FAILED_ID: 0,
  KEYWORD: ''
};

export const CommonQuery = {
  OFFSET: 'offset',
  LIMIT: 'limit',
  KEYWORD: 'keyword',
  SEARCH_TYPES: 'searchTypes'
};

export const CommonParam = {
  ID: 'id'
};

export const COMMON_ENTITY_OPTIONS: EntityOptions = {
  database: process.env.DB_MSSQL_DATABASE,
  engine: 'InnoDB'
};

export const DatabaseType = {
  REVIEW: 'review',
  STAGING: 'staging',
  PRODUCTION: 'production'
};

export const EnvFileName = {
  LOCAL: 'local.env',
  REVIEW: 'review.env',
  STAGING: 'staging.env',
  PRODUCTION: 'production.env'
};

export const CORS_OPTIONS: CorsOptions = {
  origin: /^https:\/\/grasis.*\.herokuapp.com$/,
  optionsSuccessStatus: 200
};

export const CommonPath = {
  LOGIN: '/login',
  REFRESH_TOKEN: '/refresh'
};

export const CommonColumn = {
  ID: 'id',
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at',
  DELETED_AT: 'deleted_at'
};

export const commonStringColumnOptions: ColumnOptions = {
  charset: 'utf8mb4',
  collation: 'utf8mb4_general_ci'
};

export enum ReportModule {
  PROGRESS_REPORT = 1,
  REVIEW,
  DEFENSE
}

export enum ResultModule {
  REVIEW = 1,
  DEFENSE
}
