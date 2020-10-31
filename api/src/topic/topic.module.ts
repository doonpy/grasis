import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LecturerModule } from '../lecturer/lecturer.module';
import { ThesisModule } from '../thesis/thesis.module';
import { UserModule } from '../user/user.module';
import { TopicStateEntity } from './topic-state/topic-state.entity';
import { TopicStateService } from './topic-state/topic-state.service';
import { TopicController } from './topic.controller';
import { TopicEntity } from './topic.entity';
import { TopicService } from './topic.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TopicEntity, TopicStateEntity]),
    ThesisModule,
    UserModule,
    LecturerModule
  ],
  providers: [TopicService, TopicStateService],
  controllers: [TopicController]
})
export class TopicModule {}
