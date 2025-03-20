import qs from 'node:querystring';
import https from 'https';
import http from 'http';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { IGetRequestParams, IMerjoonHttpClient, IMerjoonApiConfig } from './types';

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

  protected async sendRequest(
    method: axios.Method,
    url: string,
    data?: object,
    config?: axios.AxiosRequestConfig,
  ) {
    try {
      return await this.client.request({
        method,
        url,
        data,
        ...config,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error.response;
      }
      throw error;
    }
  }

  public async get(params: IGetRequestParams) {
    const { path, queryParams = {} } = params;
    const query = qs.stringify(queryParams);
    const res = await this.sendRequest('GET', `/${path}?${query}`);
    return res.data;
  }
}
