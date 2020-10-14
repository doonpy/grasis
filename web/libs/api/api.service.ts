import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import JwtClient from '../jwt/jwt.client';
import JwtServer from '../jwt/jwt.server';

export default class ApiService {
  private baseConfigs: AxiosRequestConfig;

  constructor() {
    this.baseConfigs = {
      baseURL: process.env.NEXT_PUBLIC_API_SERVER,
      timeout: 10000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
  }

  public setConfigs(configs: AxiosRequestConfig): void {
    this.baseConfigs = { ...this.baseConfigs, ...configs };
  }

  public async bindAuthorizationForClient(): Promise<void> {
    const jwtClient = JwtClient.getInstance();
    await jwtClient.checkTokenExpire();
    this.setConfigs({ headers: { Authorization: jwtClient.getAccessTokenForAuth() } });
  }

  public async bindAuthorizationForServer(ctx): Promise<void> {
    const jwtServer = new JwtServer(ctx);
    await jwtServer.checkTokenExpire();
    this.setConfigs({ headers: { Authorization: jwtServer.getAccessTokenForAuth() } });
  }

  public async delete<T = Record<string, any>>(url: string): Promise<AxiosResponse<T>> {
    return axios.delete<T>(url, this.baseConfigs);
  }

  public async get<T>(url: string): Promise<AxiosResponse<T>> {
    return axios.get<T>(url, this.baseConfigs);
  }

  public async post<T>(url: string, body = {}): Promise<AxiosResponse<T>> {
    return axios.post<T>(url, body, this.baseConfigs);
  }

  public async patch<T>(url: string, body = {}): Promise<AxiosError<T>> {
    return axios.patch(url, body, this.baseConfigs);
  }

  public async hooksFetcher(url: string): Promise<AxiosResponse> {
    await this.bindAuthorizationForClient();
    const { data } = await axios.get(url, this.baseConfigs);
    return data;
  }
}
