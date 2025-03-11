import qs from 'node:querystring';
import https from 'https';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { IGetRequestParams, IMerjoonHttpClient, IMerjoonApiConfig } from './types';

export class HttpClient implements IMerjoonHttpClient {
  private readonly client: AxiosInstance;

  constructor(config: IMerjoonApiConfig) {
    const axiosConfig = {
      ...config,
      httpsAgent: new https.Agent({
        maxSockets: Number(config.httpsAgent),
      }),
    };

    this.client = axios.create(axiosConfig);
  }

  protected async sendRequest(method: string, url: string, data?: object, config?: object) {
    try {
      const response = await this.client.request({
        method,
        url,
        data,
        ...config,
      });
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error.response ? error.response : new Error('Request failed without response');
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
