import qs from 'node:querystring';
import https from 'https';
import http from 'http';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { IGetRequestParams, IMerjoonHttpClient, IMerjoonApiConfig, IResponseConfig } from './types';

export class HttpClient implements IMerjoonHttpClient {
  private readonly client: AxiosInstance;

  constructor(config: IMerjoonApiConfig) {
    const isHttps = config.baseURL?.startsWith('https://');
    const agent = isHttps ? https.Agent : http.Agent;

    if (config.httpAgent) {
      config.httpAgent = new agent({
        maxSockets: config.httpAgent.maxSockets,
        keepAlive: config.httpAgent.keepAlive ?? true,
      });
    }

    this.client = axios.create(config);
  }

  protected async sendRequest<T>(
    method: axios.Method,
    url: string,
    data?: object,
    config?: axios.AxiosRequestConfig,
  ): Promise<IResponseConfig<T>> {
    try {
      const response = await this.client.request<T>({
        method,
        url,
        data,
        ...config,
      });

      return {
        data: response.data,
        status: response.status,
        headers: response.headers,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        throw {
          data: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers,
        };
      }
      throw error;
    }
  }

  public async get<T>(params: IGetRequestParams) {
    const { path, queryParams = {} } = params;
    const query = qs.stringify(queryParams as qs.ParsedUrlQueryInput);
    return this.sendRequest<T>('GET', `/${path}?${query}`);
  }
}
