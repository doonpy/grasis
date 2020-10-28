import moment from 'moment';

export interface TokenPayload {
  userId: number;
  iat: number;
  exp: number;
}

export interface StoreTokenParams {
  accessToken: string;
  refreshToken: string;
}

export type TokenResponse = StoreTokenParams;

export default class JwtBase {
  public accessToken!: string;
  public refreshToken!: string;
  public accessTokenPayload!: TokenPayload;
  public refreshTokenPayload!: TokenPayload;

  public isAccessTokenExpired(): boolean {
    return moment().isAfter(this.accessTokenPayload.exp * 1000);
  }

  public isRefreshTokenExpired(): boolean {
    return moment().isAfter(this.refreshTokenPayload.exp * 1000);
  }

  public getAccessTokenForAuth(): string {
    return `Bearer ${this.accessToken}`;
  }
}
