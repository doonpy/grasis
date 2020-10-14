import { ServerResponse } from 'http';
import jwtDecode from 'jwt-decode';
import { GetServerSidePropsContext } from 'next';
import ServerCookie from 'next-cookies';

import ApiService from '../api/api.service';
import CommonRedirect, { RenderSide } from '../common/common.redirect';
import { COMMON_PATH, COOKIES } from '../common/common.resource';
import JwtBase, { StoreTokenParams, TokenResponse } from './jwt.base';

export default class JwtServer extends JwtBase {
  private readonly res: ServerResponse;
  private readonly redirect: CommonRedirect;

  constructor(context: GetServerSidePropsContext) {
    super();
    this.res = context.res;
    this.redirect = new CommonRedirect(RenderSide.SERVER, context);
    this.initialValue(context);
  }

  private initialValue(ctx: GetServerSidePropsContext): void {
    const serverCookie = ServerCookie(ctx);
    this.accessTokenPayload = { userId: NaN, iat: 0, exp: 0 };
    this.refreshTokenPayload = { userId: NaN, iat: 0, exp: 0 };
    this.accessToken = serverCookie[COOKIES.ACCESS_TOKEN];
    this.refreshToken = serverCookie[COOKIES.REFRESH_TOKEN];
    if (this.accessToken) {
      this.accessTokenPayload = jwtDecode(this.accessToken);
    }

    if (this.refreshToken) {
      this.refreshTokenPayload = jwtDecode(this.refreshToken);
    }
  }

  public storeToken({ accessToken, refreshToken }: StoreTokenParams): void {
    if (accessToken) {
      this.accessToken = accessToken;
      this.accessTokenPayload = jwtDecode(accessToken);
    }

    if (refreshToken) {
      this.refreshToken = refreshToken;
      this.refreshTokenPayload = jwtDecode(refreshToken);
    }
  }

  public async checkTokenExpire(): Promise<void> {
    if (!this.isAccessTokenExpired()) {
      return;
    }

    if (!this.isRefreshTokenExpired()) {
      const apiService = new ApiService();
      apiService.setConfigs({ headers: { Refresh: this.refreshToken } });
      const { data } = await apiService.post<TokenResponse>(COMMON_PATH.REFRESH_TOKEN);
      this.storeToken(data);
    }
  }
}
