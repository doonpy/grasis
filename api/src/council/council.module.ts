import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CouncilAdminController } from './admin.controller';
import { CouncilController } from './council.controller';
import { CouncilEntity } from './council.entity';
import { CouncilService } from './council.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([CouncilEntity])],
  controllers: [CouncilController, CouncilAdminController],
  providers: [CouncilService],
  exports: [CouncilService]
})
export class CouncilModule {}
