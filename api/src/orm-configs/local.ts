import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

const configs: MysqlConnectionOptions = {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: 'greencare',
  database: 'grasis',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migration/**/*.js'],
  cli: {
    migrationsDir: 'src/migration'
  },
  cache: true,
  logging: true
};

export default configs;
