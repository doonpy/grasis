import { ConnectionOptions } from 'typeorm';

const localConnectionOptions: ConnectionOptions = {
  type: 'mssql',
  host: '127.0.0.1',
  port: 1433,
  username: 'sa',
  password: 'GrasisRoot13579@',
  database: 'grasis',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migration/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'dist/migration'
  },
  cache: true
};

export default localConnectionOptions;
