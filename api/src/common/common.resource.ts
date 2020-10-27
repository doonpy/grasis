import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { EntityOptions, FindOptionsWhere, IsNull } from 'typeorm';

export enum CommonQueryValue {
  OFFSET = 0,
  LIMIT = 20,
  FAILED_ID = 0
}

export enum CommonQuery {
  OFFSET = 'offset',
  LIMIT = 'limit',
  KEYWORD = 'keyword',
  SEARCH_TYPES = 'searchTypes'
}

export enum CommonParam {
  ID = 'id'
}
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
  origin: /^https:\/\/grasis.*\.herokuapp.com$/,
  optionsSuccessStatus: 200
};

export enum CommonPath {
  LOGIN = '/login',
  REFRESH_TOKEN = '/refresh'
}

export enum CommonColumn {
  ID = 'id',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
  DELETED_AT = 'deleted_at'
}

export enum CommonHeader {
  REFRESH = 'refresh'
}

export const NOT_DELETE_CONDITION: FindOptionsWhere<any> = {
  deletedAt: IsNull()
};
