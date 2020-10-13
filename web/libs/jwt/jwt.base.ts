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

  protected expiresAt(exp: number): Date {
    return new Date(exp * 1000);
  }

  public isAccessTokenExpired(): boolean {
    return new Date() > this.expiresAt(this.accessTokenPayload.exp);
  }

  public isRefreshTokenExpired(): boolean {
    return new Date() > this.expiresAt(this.refreshTokenPayload.exp);
  }

  public getAccessTokenForAuth(): string {
    return `Bearer ${this.accessToken}`;
  }
}
