import { ServerResponse } from 'http';
import { StatusCodes } from 'http-status-codes';
import { GetServerSidePropsContext } from 'next';
import Router from 'next/router';

export enum RenderSide {
  SERVER = 1,
  CLIENT
}

export default class CommonRedirect {
  public currentPath: string;
  private readonly res?: ServerResponse;

  constructor(private readonly renderSide: RenderSide, context?: GetServerSidePropsContext) {
    if (this.renderSide === RenderSide.CLIENT && !CommonRedirect.isServer()) {
      this.currentPath = Router.pathname;
    } else {
      if (context) {
        this.currentPath = context.resolvedUrl;
        this.res = context.res;
      }
    }
  }

  public resetCurrentPathForClient(): void {
    this.currentPath = Router.pathname;
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
    if (this.renderSide === RenderSide.CLIENT) {
      await this.redirectForClient(url);
    } else {
      await this.redirectForServer(url);
    }
  }
}
