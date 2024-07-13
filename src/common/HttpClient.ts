import axios from 'axios';
import qs from 'qs';
import { IGetRequestParams, IMerjoonHttpClient } from './types';

export class HttpClient implements IMerjoonHttpClient {
  constructor(protected basePath: string) {}

  public async get(params: IGetRequestParams) {
    const { path, base, queryParams = {}, config } = params;
    console.log('🚀 ~ HttpClient ~ get ~ path:', path);
    const query = qs.stringify(queryParams, { arrayFormat: 'indices' });
    console.log('🚀 ~ HttpClient ~ get ~ query:', query);
    const basePath = base || this.basePath;
    console.log(`${basePath}/${path}?${query}`);
    const res = await axios.get(`${basePath}/${path}?${query}`, config);
    return res.data;
  }
}
