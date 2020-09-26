import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { getDatabaseConfig } from './mysql/mysql.helper';
import { StudentModule } from './student/student.module';
import { LecturerModule } from './lecturer/lecturer.module';
import { LecturerPositionModule } from './lecturer-position/lecturer-position.module';
import { UserModule } from './user/user.module';

enum DatabaseType {
  LOCAL = 'local',
  REVIEW = 'review',
  STAGING = 'staging',
  PRODUCTION = 'production'
}

enum EnvFileName {
  LOCAL = 'local.env',
  REVIEW = 'review.env',
  STAGING = 'staging.env',
  PRODUCTION = 'production.env'
}

function getEnvFilePath(): string {
  let configFolderPath = './config/';
  switch (process.env.DB_TYPE) {
    case DatabaseType.REVIEW:
      configFolderPath += EnvFileName.REVIEW;
      break;
    case DatabaseType.STAGING:
      configFolderPath += EnvFileName.STAGING;
      break;
    case DatabaseType.PRODUCTION:
      configFolderPath += EnvFileName.PRODUCTION;
      break;
    default:
      configFolderPath += EnvFileName.LOCAL;
      break;
  }

  return configFolderPath;
}

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: getEnvFilePath() }),
    SequelizeModule.forRoot(getDatabaseConfig(true)),
    UserModule,
    StudentModule,
    LecturerModule,
    LecturerPositionModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
