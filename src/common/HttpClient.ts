import qs from 'node:querystring';
import axios from 'axios';
import https from 'https';
import { IGetRequestParams, IMerjoonHttpClient } from './types';

export class HttpClient implements IMerjoonHttpClient {
  private agent: https.Agent;

  constructor(protected basePath: string, maxSockets: number) {
    this.agent = new https.Agent({ maxSockets });
  }

  public async get(params: IGetRequestParams) {
    const {path, base, queryParams = {}, config} = params;
    const query = qs.stringify(queryParams);
    const basePath = base ?? this.basePath;

    const axiosConfig = {
      ...config,
      httpsAgent: this.agent,
    };

    const res = await axios.get(`${basePath}/${path}?${query}`, axiosConfig);
    return res.data;
  }
}
