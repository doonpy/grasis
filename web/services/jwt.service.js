import Cookie from 'js-cookie';
import jwtDecode from 'jwt-decode';
import ServerCookie from 'next-cookies';
import Router from 'next/router';

import { COOKIES } from './cookie.service';

export class JwtService {
  constructor(token) {
    this.decodedToken = { user: null, exp: 0 };

    try {
      if (token) this.decodedToken = jwtDecode(token);
    } catch (e) {
      console.log(e);
    }
  }

  authorizationString() {
    return `Bearer ${this.token}`;
  }

  expiresAt() {
    return new Date(this.decodedToken.exp * 1000);
  }

  isExpired() {
    return new Date() > this.expiresAt();
  }

  isValid() {
    return !this.isExpired();
  }

  static fromNext(ctx) {
    const token = ServerCookie(ctx)[COOKIES.authToken];
    return new JwtService(token);
  }

  static async storeToken(token) {
    Cookie.set(COOKIES.authToken, token);
    await Router.push('/');
  }

  static async deleteToken() {
    Cookie.remove(COOKIES.authToken);
    await Router.push('/login');
  }
}
