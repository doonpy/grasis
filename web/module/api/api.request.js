import axios from 'axios';
import Cookies from 'js-cookie';

import { JwtService } from '../auth/jwt.service';
import { COOKIES } from '../common/cookie';

export default class ApiRequest {
  constructor(token) {
    this.baseConfigs = {
      baseURL: process.env.NEXT_PUBLIC_API_SERVER,
      timeout: 10000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || Cookies.get(COOKIES.authToken)}`
      }
    };
  }

  async delete(url) {
    const res = await axios.delete(url, this.baseConfigs).catch(this.errorHandler);
    if (res.data) {
      return res.data;
    }

    return res;
  }

  async get(url) {
    const res = await axios.get(url, this.baseConfigs).catch(this.errorHandler);
    if (res.data) {
      return res.data;
    }

    return res;
  }

  async post(url, body = {}) {
    const res = await axios.post(url, body, this.baseConfigs).catch(this.errorHandler);
    if (res.data) {
      return res.data;
    }

    return res;
  }

  async patch(url, body = {}) {
    const res = await axios.patch(url, body, this.baseConfigs).catch(this.errorHandler);
    if (res.data) {
      return res.data;
    }

    return res;
  }

  errorHandler({ response, message }) {
    if (response) {
      if (response.status === 401) {
        JwtService.deleteToken();
      }

      return response;
    }

    window.location.replace(`/error/500?title=Lỗi&message=${message}`);
    return message;
  }
}
