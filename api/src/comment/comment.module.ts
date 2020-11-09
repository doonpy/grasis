import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentController } from './comment.controller';
import { CommentEntity } from './comment.entity';
import { CommentService } from './comment.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity])],
  providers: [CommentService],
  controllers: [CommentController],
  exports: [CommentService]
})
export class CommentModule {}
