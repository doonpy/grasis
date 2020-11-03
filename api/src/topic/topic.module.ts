import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TopicStateEntity } from './topic-state/topic-state.entity';
import { TopicStateService } from './topic-state/topic-state.service';
import { TopicStudentEntity } from './topic-student/topic_student.entity';
import { TopicStudentService } from './topic-student/topic-student.service';
import { TopicController } from './topic.controller';
import { TopicEntity } from './topic.entity';
import { TopicService } from './topic.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([TopicEntity, TopicStateEntity, TopicStudentEntity])],
  providers: [TopicService, TopicStateService, TopicStudentService],
  controllers: [TopicController],
  exports: [TopicService]
})
export class TopicModule {}
