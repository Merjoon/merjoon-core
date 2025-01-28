import qs from 'node:querystring';
import axios, { AxiosInstance } from 'axios';
import { IGetRequestParams, IMerjoonHttpClient, IMerjoonApiConfig } from './types';

export class HttpClient implements IMerjoonHttpClient {
  private readonly request: AxiosInstance;

  constructor(config: IMerjoonApiConfig) {
    this.request = axios.create(config);
  }

  public async get(params: IGetRequestParams) {
    const { path, queryParams = {} } = params;
    const query = qs.stringify(queryParams);

    const res = await this.request.get(`/${path}?${query}`);
    return res.data;
  }
}
