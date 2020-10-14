import { AxiosResponse } from 'axios';
import { IncomingMessage, ServerResponse } from 'http';
import { GetServerSidePropsContext } from 'next';

import ApiService from '../api/api.service';
import CommonServer from '../common/common.server';
import { FindUserByIdResponse } from './user.interface';

export default class UserServer extends CommonServer {
  private readonly req: IncomingMessage;
  private readonly res: ServerResponse;

  constructor(ctx: GetServerSidePropsContext) {
    super(ctx);
    this.req = ctx.req;
    this.res = ctx.res;
  }

  public async getUserById(
    userId: number,
    accessToken: string
  ): Promise<AxiosResponse<FindUserByIdResponse>> {
    const apiRequest = new ApiService();
    apiRequest.setConfigs({ headers: { Authorization: accessToken } });

    return apiRequest.get<FindUserByIdResponse>(`/users/${userId}`);
  }
}
