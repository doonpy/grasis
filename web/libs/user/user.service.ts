import { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import useSWR from 'swr';

import { LecturerRequestBody } from '../../../api/src/lecturer/lecturer.interface';
import { COMMON_PATH, COOKIES } from '../common/common.resource';
import CommonService from '../common/common.service';
import { TokenResponse } from '../jwt/jwt.base';
import { StudentRequestBody } from '../student/student.interface';
import { FindUserByIdResponse, LoginInputs, Remember, UserRequestBody } from './user.interface';
import { IsAdmin, USER_API, UserStatus } from './user.resource';

export default class UserService extends CommonService {
  private static instance: UserService;

  constructor() {
    super();
  }

  public static getInstance(): UserService {
    if (!this.instance) {
      this.instance = new UserService();
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

  public isAdminCheck(isAdmin: IsAdmin): boolean {
    return isAdmin === IsAdmin.TRUE;
  }

  public isAllowUserType(allowUserTypes, userType): boolean {
    return allowUserTypes.indexOf(userType) !== -1;
  }

  public useAuthorization(): FindUserByIdResponse {
    const userId = this.jwtService.accessTokenPayload.userId;
    const currentPath = this.redirectService.currentPath;
    const { data } = useSWR<FindUserByIdResponse>(`${USER_API.ROOT}/${userId}`, {
      onSuccess: async () => {
        this.jwtService.initialValue();
        this.redirectService.resetCurrentPathForClient();
        if (userId && currentPath === COMMON_PATH.LOGIN) {
          await this.redirectService.redirectTo(COMMON_PATH.INDEX);
        }
      }
    });

    return data;
  }

  public convertToRequestBody(user: StudentRequestBody | LecturerRequestBody): UserRequestBody {
    const result = user;
    const { isAdmin, status } = user;
    if (typeof isAdmin !== 'undefined' && isAdmin !== null) {
      result.isAdmin = isAdmin ? IsAdmin.TRUE : IsAdmin.FALSE;
    }

    if (typeof status !== 'undefined' && status !== null) {
      result.status = status ? UserStatus.ACTIVE : UserStatus.INACTIVE;
    }

    return result;
  }
}
