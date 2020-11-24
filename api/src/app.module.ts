import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import ExpressUserAgent from 'express-useragent';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AvatarModule } from './avatar/avatar.module';
import { AwsModule } from './aws/aws.module';
import { CommentModule } from './comment/comment.module';
import { CommonPath, DatabaseType, EnvFileName } from './common/common.resource';
import { CouncilModule } from './council/council.module';
import { getDatabaseConfig } from './database/database.helper';
import { DefenseModule } from './defense/defense.module';
import { DownloadModule } from './download/download.module';
import { LecturerModule } from './lecturer/lecturer.module';
import { ProgressReportModule } from './progress-report/progress-report.module';
import { RefreshModule } from './refresh/refresh.module';
import { ReviewModule } from './review/review.module';
import { StudentModule } from './student/student.module';
import { ThesisModule } from './thesis/thesis.module';
import { TopicModule } from './topic/topic.module';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';

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
    ScheduleModule.forRoot(),
    UserModule,
    StudentModule,
    LecturerModule,
    AuthModule,
    UploadModule,
    AvatarModule,
    RefreshModule,
    ThesisModule,
    TopicModule,
    ProgressReportModule,
    CommentModule,
    AwsModule,
    DownloadModule,
    ReviewModule,
    CouncilModule,
    DefenseModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(ExpressUserAgent.express())
      .forRoutes(
        { path: CommonPath.LOGIN, method: RequestMethod.POST },
        { path: CommonPath.REFRESH_TOKEN, method: RequestMethod.POST }
      );
  }
}
