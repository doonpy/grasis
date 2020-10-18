import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RefreshEntity } from './refresh.entity';
import { REFRESH_EXPIRE_TIME } from './refresh.resource';
import { RefreshService } from './refresh.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (): JwtModuleOptions => ({
        secret: process.env.REFRESH_SECRET,
        signOptions: { expiresIn: REFRESH_EXPIRE_TIME }
      })
    }),
    TypeOrmModule.forFeature([RefreshEntity])
  ],
  providers: [RefreshService],
  exports: [RefreshService]
})
export class RefreshModule {}
