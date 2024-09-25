import qs from 'node:querystring';
import axios from 'axios';
import { IGetRequestParams, IMerjoonHttpClient } from './types';

export class HttpClient implements IMerjoonHttpClient {

  constructor(protected basePath: string) {
  }

  public async get(params: IGetRequestParams) {
    const {path, base, queryParams = {}, config} = params;
    const query = qs.stringify(queryParams)
    const basePath = base || this.basePath;
    // console.log(`full path = ${basePath}/${path}?${query}`);
    // console.log(`config = ${JSON.stringify(config, null, 2)}`);
    const res = await axios.get(`${basePath}/${path}?${query}`, config);
    // console.log(`res = ${JSON.stringify(res.data, null, 2)}`);
    return res.data;
  }
}
