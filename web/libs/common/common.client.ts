import { message } from 'antd';
import { StatusCodes } from 'http-status-codes';

import ApiService from '../api/api.service';
import JwtClient from '../jwt/jwt.client';
import CommonRedirect, { RenderSide } from './common.redirect';
import { COMMON_PATH } from './common.resource';

export default class CommonClient {
  public readonly apiService: ApiService;
  public readonly jwtService: JwtClient;
  public readonly redirectService: CommonRedirect;

  constructor() {
    this.apiService = new ApiService();
    this.jwtService = JwtClient.getInstance();
    this.redirectService = new CommonRedirect(RenderSide.CLIENT);
  }

  public async requestErrorHandler(error): Promise<void> {
    if (error.response) {
      const { data } = error.response;
      if (
        data.statusCode === StatusCodes.UNAUTHORIZED &&
        this.redirectService.currentPath !== COMMON_PATH.LOGIN
      ) {
        this.jwtService.deleteAllToken();
        message.loading(`[${data.statusCode}] ${data.message}`, 2.5).then(
          async () => await this.redirectService.redirectTo(COMMON_PATH.LOGIN),
          () => undefined
        );
      } else {
        message.error(`[${data.statusCode}] ${data.message}`);
      }
    } else {
      await this.redirectService.redirectTo(
        `${COMMON_PATH.ERROR.ERR_500}?title=${error.name}&message=${error.message}`
      );
    }
  }
}
