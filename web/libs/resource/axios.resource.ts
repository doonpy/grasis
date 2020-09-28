import { AxiosRequestConfig } from 'axios';

export const axiosBaseConfigs: AxiosRequestConfig = {
  baseURL: process.env.API_SERVER,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
};
