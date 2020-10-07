import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AvatarModule } from './avatar/avatar.module';
import { LecturerModule } from './lecturer/lecturer.module';
import { getDatabaseConfig } from './mssql/mssql.helper';
import { StudentModule } from './student/student.module';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';

enum DatabaseType {
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
    TypeOrmModule.forRoot(getDatabaseConfig()),
    UserModule,
    StudentModule,
    LecturerModule,
    AuthModule,
    UploadModule,
    AvatarModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
