import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

import { axiosBaseConfigs } from '../../libs/resource/axios.resource';
import { COOKIES } from '../../libs/resource/cookie.resource';
import { JwtService } from './jwt.service';

export interface LoginInputs {
  username: string;
  password: string;
}

export interface RememberMe {
  status: boolean;
  username: string;
}

export async function post(url: string, data: any): Promise<AxiosResponse> {
  return axios.post(url, data, axiosBaseConfigs).catch((error) => error.response);
}

export async function postLogin(inputs: LoginInputs): Promise<string | undefined> {
  const {
    data: { accessToken, message },
    status
  } = await post('/login', inputs);

  if (status === 201 && accessToken) {
    await JwtService.storeToken(accessToken);
    return;
  }

  return message;
}

export function getRememberMeValue(): RememberMe {
  const rememberMeCookie = Cookies.get(COOKIES.rememberMe);

  if (!rememberMeCookie) {
    return { status: false, username: '' };
  }

  return JSON.parse(rememberMeCookie);
}

export function setRememberMeValue(value: RememberMe): void {
  Cookies.set(COOKIES.rememberMe, JSON.stringify(value), { expires: 7 });
}
