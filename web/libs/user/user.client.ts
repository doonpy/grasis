import { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import useSWR from 'swr';

import CommonClient from '../common/common.client';
import { COMMON_PATH, COOKIES } from '../common/common.resource';
import { TokenResponse } from '../jwt/jwt.base';
import {
  FindUserByIdResponse,
  LoginInputs,
  Remember,
  UseAuthorizationParams
} from './user.interface';
import { IsAdmin, USER_API } from './user.resource';

export default class UserClient extends CommonClient {
  private static instance: UserClient;

  constructor() {
    super();
  }

  public static getInstance(): UserClient {
    if (!this.instance) {
      this.instance = new UserClient();
    }

    return this.instance;
  }

  public async login(inputs: LoginInputs): Promise<void> {
    this.jwtService.initialValue();
    if (!this.jwtService.isAccessTokenExpired()) {
      return;
    }

    const { data } = await this.apiService.post<TokenResponse>(COMMON_PATH.LOGIN, inputs);
    this.jwtService.storeToken(data);
  }

  public async getUserById(userId: number): Promise<AxiosResponse<FindUserByIdResponse>> {
    await this.apiService.bindAuthorizationForClient();

    return this.apiService.get<FindUserByIdResponse>(`${USER_API}/${userId}`);
  }

  public getRememberValue(): Remember {
    let result: Remember = { username: '' };
    const rememberCookie = Cookies.get(COOKIES.REMEMBER_ME);
    if (rememberCookie) {
      result = JSON.parse(rememberCookie);
    }

    return result;
  }

  public setRememberValue(value: Remember): void {
    Cookies.set(COOKIES.REMEMBER_ME, JSON.stringify(value), { expires: Number.MAX_SAFE_INTEGER });
  }

  public async logout(): Promise<void> {
    this.jwtService.deleteAllToken();
    await this.redirectService.redirectTo(COMMON_PATH.LOGIN);
  }

  public async isAdminCheck(isAdmin: IsAdmin): Promise<void> {
    if (isAdmin === IsAdmin.FALSE) {
      await this.redirectService.redirectTo(COMMON_PATH.ERROR.ERR_403);
    }
  }

  public async userTypeCheck(allowUserTypes, userType): Promise<void> {
    if (allowUserTypes.indexOf(userType) === -1) {
      await this.redirectService.redirectTo(COMMON_PATH.ERROR.ERR_403);
    }
  }

  public useAuthorization({
    isAdminCheck,
    allowUserTypes
  }: UseAuthorizationParams): FindUserByIdResponse {
    const userId = this.jwtService.accessTokenPayload.userId;
    const currentPath = this.redirectService.currentPath;
    const { data } = useSWR<FindUserByIdResponse>(`${USER_API.ROOT}/${userId}`, {
      onSuccess: async () => {
        this.jwtService.initialValue();

        if (userId && currentPath === COMMON_PATH.LOGIN) {
          await this.redirectService.redirectTo(COMMON_PATH.INDEX);
          return;
        }

        if (data) {
          if (isAdminCheck) {
            await this.isAdminCheck(data.user.isAdmin);
          }

          if (allowUserTypes) {
            await this.userTypeCheck(allowUserTypes, data.user.isAdmin);
          }
        }
      }
    });

    return data;
  }
}
