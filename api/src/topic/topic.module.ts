import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TopicEntity } from './entities/topic.entity';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { TopicStateEntity } from './topic-state/topic-state.entity';
import { TopicStateService } from './topic-state/topic-state.service';
import { TopicStudentEntity } from './topic-student/topic-student.entity';
import { TopicStudentService } from './topic-student/topic-student.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([TopicEntity, TopicStateEntity, TopicStudentEntity])],
  providers: [TopicService, TopicStateService, TopicStudentService],
  controllers: [TopicController],
  exports: [TopicService, TopicStudentService]
})
export class TopicModule {}
