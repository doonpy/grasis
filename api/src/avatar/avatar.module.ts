import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { AvatarController } from './avatar.controller';
import { AvatarService } from './avatar.service';

@Module({
  imports: [UserModule],
  controllers: [AvatarController],
  providers: [AvatarService]
})
export class AvatarModule {}
