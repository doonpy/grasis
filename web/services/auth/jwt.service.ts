import Cookie from 'js-cookie';
import jwtDecode from 'jwt-decode';
import { GetServerSidePropsContext, NextPageContext } from 'next';
import ServerCookie from 'next-cookies';
import Router from 'next/router';

import { COOKIES } from '../../libs/resource/cookie.resource';
import { Lecturer } from '../lecturer/lecturer.service';
import { Student } from '../student/student.service';

export interface DecodedToken {
  readonly user: Lecturer | Student | null;
  readonly exp: number;
}

export class JwtService {
  readonly decodedToken: DecodedToken;

  constructor(readonly token?: string) {
    this.decodedToken = { user: null, exp: 0 };

    try {
      if (token) this.decodedToken = jwtDecode(token);
    } catch (e) {
      console.log(e);
    }
  }

  public authorizationString(): string {
    return `Bearer ${this.token}`;
  }

  public expiresAt(): Date {
    return new Date(this.decodedToken.exp * 1000);
  }

  public isExpired(): boolean {
    return new Date() > this.expiresAt();
  }

  public isValid(): boolean {
    return !this.isExpired();
  }

  public static fromNext(ctx: NextPageContext | GetServerSidePropsContext): JwtService {
    const token = ServerCookie(ctx)[COOKIES.authToken];
    return new JwtService(token);
  }

  public static async storeToken(token: string): Promise<void> {
    Cookie.set(COOKIES.authToken, token);
    await Router.push('/');
  }
}
