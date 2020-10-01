import axios from 'axios';
import Cookies from 'js-cookie';
import getConfig from 'next/config';

import { COOKIES } from '../cookie.service';

const { publicRuntimeConfig } = getConfig();

export default class Request {
  constructor(token) {
    this.baseConfigs = {
      baseURL: publicRuntimeConfig.API_SERVER,
      timeout: 10000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || Cookies.get(COOKIES.authToken)}`
      }
    };
  }

  async delete(url) {
    return axios.delete(url, this.baseConfigs);
  }

  async get(url) {
    const { data } = await axios.get(url, this.baseConfigs).catch(({ response }) => response);

    return data;
  }

  async post(url, body = {}) {
    return axios.post(url, body, this.baseConfigs);
  }

  async patch(url, body = {}) {
    return axios.patch(url, body, this.baseConfigs);
  }

  async put(url, body = {}) {
    return axios.put(url, body, this.baseConfigs);
  }
}
