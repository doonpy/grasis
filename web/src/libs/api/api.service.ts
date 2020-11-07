import axios, { AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios';

import JwtClient from '../jwt/jwt.client';

export default class ApiService {
  private baseConfigs: AxiosRequestConfig;
  private cancelSource!: CancelTokenSource;

  constructor() {
    this.baseConfigs = {
      baseURL: this.getBaseUrl(),
      timeout: 20000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
  }

  public getBaseUrl(): string {
    if (process.env.NEXT_PUBLIC_HEROKU_PR_NUMBER) {
      return `https://grasis-api-pr-${process.env.NEXT_PUBLIC_HEROKU_PR_NUMBER}.herokuapp.com`;
    }

    return process.env.NEXT_PUBLIC_API_SERVER || '';
  }

  public setConfigs(configs: AxiosRequestConfig): void {
    this.baseConfigs = { ...this.baseConfigs, ...configs };
  }

  public async bindAuthorizationForClient(): Promise<void> {
    const jwtClient = JwtClient.getInstance();
    await jwtClient.checkTokenExpire();
    this.setConfigs({ headers: { Authorization: jwtClient.getAccessTokenForAuth() } });
  }

  public async delete<T = Record<string, any>>(
    url: string,
    params: (string | number)[] = []
  ): Promise<AxiosResponse<T>> {
    url = this.replaceParams(url, params);

    return axios.delete<T>(url, this.baseConfigs);
  }

  public async get<T>(url: string, params: (string | number)[] = []): Promise<AxiosResponse<T>> {
    url = this.replaceParams(url, params);

    return axios.get<T>(url, this.baseConfigs);
  }

  public async post<T>(
    url: string,
    body = {},
    params: (string | number)[] = []
  ): Promise<AxiosResponse<T>> {
    url = this.replaceParams(url, params);

    return axios.post<T>(url, body, this.baseConfigs);
  }

  public async patch<T>(
    url: string,
    body = {},
    params: (string | number)[] = []
  ): Promise<AxiosResponse<T>> {
    url = this.replaceParams(url, params);

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

  private replaceParams(url: string, params: (string | number)[]): string {
    let result = url;
    params.forEach((param, index) => {
      result = result.replace(`@${index}`, encodeURI(param.toString()));
    });

    return result;
  }
}
