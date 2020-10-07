import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import ServerCookie from 'next-cookies';
import Router from 'next/router';

import { COOKIES } from '../common/cookie';
import { USER_STATUS } from '../user/user.resource';

export class JwtService {
  constructor(token, remember) {
    this.decodedToken = { user: null, exp: 0 };
    this.token = '';
    this.remember = { status: false, username: '' };
    try {
      if (token) {
        this.decodedToken = jwtDecode(token);
        this.token = token;
      }
      if (remember) {
        this.remember = remember;
      }
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

  isActive() {
    return this.decodedToken.user.status === USER_STATUS.ACTIVE;
  }

  static fromNext(ctx) {
    const token = ServerCookie(ctx)[COOKIES.authToken];
    const remember = ServerCookie(ctx)[COOKIES.rememberMe];
    return new JwtService(token, remember);
  }

  static async storeToken(token) {
    Cookies.set(COOKIES.authToken, token);
    await Router.push('/');
  }

  static getAuthTokenFromCookie() {
    return `Bearer ${Cookies.get(COOKIES.authToken)}`;
  }

  static async deleteToken() {
    Cookies.remove(COOKIES.authToken);
    await Router.push('/login');
  }

  static setRememberValue(value) {
    Cookies.set(COOKIES.rememberMe, JSON.stringify(value), { expires: 7 });
  }
}
