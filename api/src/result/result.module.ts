import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResultController } from './result.controller';
import { ResultEntity } from './result.entity';
import { ResultService } from './result.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ResultEntity])],
  providers: [ResultService],
  controllers: [ResultController],
  exports: [ResultService]
})
export class ResultModule {}
