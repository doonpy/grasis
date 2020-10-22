import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios';

import JwtClient from '../jwt/jwt.client';

export default class ApiService {
  private baseConfigs: AxiosRequestConfig;
  private cancelSource: CancelTokenSource;

  constructor() {
    this.baseConfigs = {
      baseURL: this.getBaseUrl(),
      timeout: 10000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
  }

  private getBaseUrl(): string {
    if (process.env.NEXT_PUBLIC_HEROKU_PR_NUMBER) {
      return `https://grasis-api-pr-${process.env.NEXT_PUBLIC_HEROKU_PR_NUMBER}.herokuapp.com`;
    }

    return process.env.NEXT_PUBLIC_API_SERVER;
  }

  public setConfigs(configs: AxiosRequestConfig): void {
    this.baseConfigs = { ...this.baseConfigs, ...configs };
  }

  public async bindAuthorizationForClient(): Promise<void> {
    const jwtClient = JwtClient.getInstance();
    await jwtClient.checkTokenExpire();
    this.setConfigs({ headers: { Authorization: jwtClient.getAccessTokenForAuth() } });
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

  public cancelPreviousRequest(): void {
    this.cancelSource.cancel();
  }

  public bindCancelToken() {
    this.cancelSource = axios.CancelToken.source();
    this.setConfigs({ cancelToken: this.cancelSource.token });
  }
}
