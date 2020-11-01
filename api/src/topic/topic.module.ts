import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LecturerModule } from '../lecturer/lecturer.module';
import { StudentModule } from '../student/student.module';
import { ThesisModule } from '../thesis/thesis.module';
import { UserModule } from '../user/user.module';
import { TopicStateEntity } from './topic-state/topic-state.entity';
import { TopicStateService } from './topic-state/topic-state.service';
import { TopicStudentEntity } from './topic-student/topic_student.entity';
import { TopicStudentService } from './topic-student/topic-student.service';
import { TopicController } from './topic.controller';
import { TopicEntity } from './topic.entity';
import { TopicService } from './topic.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TopicEntity, TopicStateEntity, TopicStudentEntity]),
    ThesisModule,
    UserModule,
    LecturerModule,
    StudentModule
  ],
  providers: [TopicService, TopicStateService, TopicStudentService],
  controllers: [TopicController]
})
export class TopicModule {}
