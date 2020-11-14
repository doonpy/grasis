import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReviewAdminController } from './admin.controller';
import { ReviewController } from './review.controller';
import { ReviewEntity } from './review.entity';
import { ReviewService } from './review.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity])],
  providers: [ReviewService],
  controllers: [ReviewController, ReviewAdminController],
  exports: [ReviewService]
})
export class ReviewModule {}
