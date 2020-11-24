import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DefenseAdminController } from './admin.controller';
import { DefenseController } from './defense.controller';
import { DefenseEntity } from './defense.entity';
import { DefenseService } from './defense.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([DefenseEntity])],
  providers: [DefenseService],
  controllers: [DefenseController, DefenseAdminController],
  exports: [DefenseService]
})
export class DefenseModule {}
