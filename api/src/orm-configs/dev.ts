import { ConnectionOptions } from 'typeorm';

const devConnectionOptions: ConnectionOptions = {
  type: 'mssql',
  host: 'poonnguyen.database.windows.net',
  port: 1433,
  username: 'doonpy',
  password: 'PoonPu13579',
  database: 'grasis_prod',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migration/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'dist/migration'
  },
  cache: true
};

export default devConnectionOptions;
