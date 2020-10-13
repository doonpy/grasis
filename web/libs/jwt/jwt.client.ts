import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

import ApiService from '../api/api.service';
import CommonRedirect, { RenderSide } from '../common/common.redirect';
import { COMMON_PATH, COOKIES } from '../common/common.resource';
import JwtBase, { StoreTokenParams, TokenPayload } from './jwt.base';

export default class JwtClient extends JwtBase {
  private static instance: JwtClient;
  private readonly redirect: CommonRedirect;

  constructor() {
    super();
    this.redirect = new CommonRedirect(RenderSide.CLIENT);
    this.initialValue();
  }

  public static getInstance(): JwtClient {
    if (!this.instance) {
      this.instance = new JwtClient();
    }

    return this.instance;
  }

  public initialValue(): void {
    this.accessTokenPayload = { userId: NaN, iat: 0, exp: 0 };
    this.refreshTokenPayload = { userId: NaN, iat: 0, exp: 0 };
    this.accessToken = Cookies.get(COOKIES.ACCESS_TOKEN);
    this.refreshToken = Cookies.get(COOKIES.REFRESH_TOKEN);
    if (this.accessToken) {
      this.accessTokenPayload = jwtDecode(this.accessToken);
    }

    if (this.refreshToken) {
      this.refreshTokenPayload = jwtDecode(this.refreshToken);
    }
  }

  public deleteAllToken(): void {
    Cookies.remove(COOKIES.ACCESS_TOKEN);
    Cookies.remove(COOKIES.REFRESH_TOKEN);
    this.accessTokenPayload = { userId: NaN, iat: 0, exp: 0 };
    this.refreshTokenPayload = { userId: NaN, iat: 0, exp: 0 };
    this.accessToken = null;
    this.refreshToken = null;
  }

  public storeToken({ accessToken, refreshToken }: StoreTokenParams): void {
    if (accessToken) {
      const accessTokenPayload: TokenPayload = jwtDecode(accessToken);
      if (accessTokenPayload.exp > this.accessTokenPayload.exp) {
        Cookies.set(COOKIES.ACCESS_TOKEN, accessToken);
        this.accessToken = accessToken;
        this.accessTokenPayload = accessTokenPayload;
      }
    }

    if (refreshToken) {
      const refreshTokenPayload: TokenPayload = jwtDecode(refreshToken);
      if (refreshTokenPayload.exp > this.refreshTokenPayload.exp) {
        Cookies.set(COOKIES.REFRESH_TOKEN, refreshToken, { expires: 1 });
        this.refreshTokenPayload = refreshTokenPayload;
        this.refreshToken = refreshToken;
      }
    }
  }

  public async checkTokenExpire(): Promise<void> {
    if (!this.isAccessTokenExpired()) {
      return;
    }

    if (this.isRefreshTokenExpired()) {
      this.deleteAllToken();
    } else {
      const apiClient = new ApiService();
      apiClient.setConfigs({ headers: { Refresh: this.refreshToken } });
      const { data } = await apiClient.post<StoreTokenParams>(COMMON_PATH.REFRESH_TOKEN);
      this.storeToken(data);
    }
  }
}
