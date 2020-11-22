import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';

import { Payload } from '../auth/strategies/jwt.strategy';
import { RefreshEntity } from './refresh.entity';
import {
  REFRESH_ERROR,
  REFRESH_EXPIRE_TIME,
  REFRESH_EXPIRE_TIME_BY_DAYS
} from './refresh.resource';
import { CreateRefresh, GetRefresh, Refresh } from './refresh.type';

@Injectable()
export class RefreshService {
  constructor(
    @InjectRepository(RefreshEntity) private readonly refreshRepository: Repository<Refresh>,
    private readonly jwtService: JwtService
  ) {}

  public async validateRefreshToken(refreshToken: string): Promise<void> {
    let payload: Payload | undefined;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_SECRET
      }) as Payload;
    } catch (error) {
      throw new UnauthorizedException(REFRESH_ERROR.ERR_1);
    }

    const { userId } = payload;
    if (!(await this.isRefreshTokenExist(userId, refreshToken))) {
      throw new UnauthorizedException(REFRESH_ERROR.ERR_1);
    }
  }

  public async isRefreshTokenExist(userId: number, refreshToken: string): Promise<boolean> {
    return (await this.refreshRepository.count({ userId, refreshToken })) > 0;
  }

  public async getNewToken(userId: number): Promise<string> {
    return this.jwtService.sign(
      { userId },
      { secret: process.env.REFRESH_SECRET, expiresIn: REFRESH_EXPIRE_TIME }
    );
  }

  public async getPayloadFromRefreshToken(refreshToken: string): Promise<Payload> {
    return this.jwtService.decode(refreshToken) as Payload;
  }

  public async create(data: CreateRefresh): Promise<void> {
    const { refreshToken, ...conditions } = data;
    const currentRefreshToken = await this.getByConditions(conditions);

    if (!currentRefreshToken) {
      const newRefreshToken = this.refreshRepository.create(data);
      await this.refreshRepository.save(newRefreshToken);
    } else {
      currentRefreshToken.refreshToken = refreshToken as string;
      await this.refreshRepository.save(currentRefreshToken);
    }
  }

  public async getByConditions(conditions: GetRefresh): Promise<Refresh | undefined> {
    return this.refreshRepository.findOne(conditions, {
      cache: { milliseconds: 1000 * 60 * 15 }
    });
  }

  public async deleteExpiredToken(userId: number): Promise<void> {
    const expiredTime = new Date();
    expiredTime.setDate(expiredTime.getDate() - REFRESH_EXPIRE_TIME_BY_DAYS);

    await this.refreshRepository.delete({ userId, updatedAt: LessThanOrEqual(expiredTime) });
  }
}
