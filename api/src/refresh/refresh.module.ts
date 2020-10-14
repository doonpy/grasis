import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

import { UserModule } from '../user/user.module';
import { RefreshService } from './refresh.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (): JwtModuleOptions => ({
        secret: process.env.REFRESH_SECRET,
        signOptions: { expiresIn: '1d' }
      })
    }),
    UserModule
  ],
  providers: [RefreshService],
  exports: [RefreshService]
})
export class RefreshModule {}
