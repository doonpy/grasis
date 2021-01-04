import { ServerResponse } from 'http';
import { StatusCodes } from 'http-status-codes';
import { GetServerSidePropsContext } from 'next';
import Router from 'next/router';

import { COMMON_PATH, REDIRECT_URL_QUERY } from './common.resource';

export enum RenderSide {
  SERVER = 1,
  CLIENT
}

export default class CommonRedirect {
  private readonly res!: ServerResponse;

  constructor(private readonly renderSide: RenderSide, context?: GetServerSidePropsContext) {
    if (context) {
      this.res = context.res;
    }
  }

  private async redirectForServer(url: string): Promise<void> {
    this.res.writeHead(StatusCodes.MOVED_TEMPORARILY, { Location: url }).end();
  }

  private async redirectForClient(url: string): Promise<void> {
    await Router.push(url);
  }

  public static isServer(): boolean {
    return typeof window === 'undefined';
  }

  public async redirectTo(url: string): Promise<void> {
    if (url === COMMON_PATH.LOGIN) {
      url += `?${REDIRECT_URL_QUERY}=${Router.asPath}`;
    }

    if (this.renderSide === RenderSide.CLIENT) {
      await this.redirectForClient(url);
    } else {
      await this.redirectForServer(url);
    }
  }
}
