import Cookies from 'js-cookie';

import RequestApi from '../api/request.api';
import { COOKIES } from '../cookie.service';
import { JwtService } from '../jwt.service';

export async function postLogin(inputs) {
  const request = new RequestApi();
  const { data, status } = await request.post('/login', inputs).catch(({ response }) => response);

  if (status === 201) {
    await JwtService.storeToken(data.accessToken);
  }

  if (status === 401) {
    return data.message;
  }
}

export function getRememberMeValue() {
  const rememberMeCookie = Cookies.get(COOKIES.rememberMe);

  if (!rememberMeCookie) {
    return { status: false, username: '' };
  }

  return JSON.parse(rememberMeCookie);
}

export function setRememberMeValue(value) {
  Cookies.set(COOKIES.rememberMe, JSON.stringify(value), { expires: 7 });
}

export async function logout() {
  await JwtService.deleteToken();
}
