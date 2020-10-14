import { message } from 'antd';
import { StatusCodes } from 'http-status-codes';
import { GetServerSidePropsContext } from 'next';

import ApiService from '../api/api.service';
import JwtServer from '../jwt/jwt.server';
import CommonRedirect, { RenderSide } from './common.redirect';
import { COMMON_PATH } from './common.resource';

export default class CommonServer {
  public readonly apiService: ApiService;
  public readonly jwtService: JwtServer;
  public readonly redirectService: CommonRedirect;
  protected ctx: GetServerSidePropsContext;

  constructor(ctx: GetServerSidePropsContext) {
    this.apiService = new ApiService();
    this.jwtService = new JwtServer(ctx);
    this.redirectService = new CommonRedirect(RenderSide.SERVER, ctx);
    this.ctx = ctx;
  }

  public async requestErrorHandler(error): Promise<void> {
    if (error.response) {
      const { data } = error.response;
      if (
        data.statusCode === StatusCodes.UNAUTHORIZED &&
        this.redirectService.currentPath !== COMMON_PATH.LOGIN
      ) {
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
