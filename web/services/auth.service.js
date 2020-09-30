import axios from 'axios';
import Cookies from 'js-cookie';

import { axiosBaseConfigs } from './axios.service';
import { COOKIES } from './cookie.service';
import { JwtService } from './jwt.service';

export async function post(url, data) {
  return axios.post(url, data, axiosBaseConfigs);
}

export async function postLogin(inputs) {
  try {
    const {
      data: { accessToken, message },
      status
    } = await post('/login', inputs);

    if (status === 201 && accessToken) {
      await JwtService.storeToken(accessToken);
    }

    return message;
  } catch ({ message }) {
    return message;
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
