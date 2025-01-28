import { HttpClient } from '../common/HttpClient';
import { IMerjoonApiConfig } from '../common/types';
import { HeightApiPath, IHeightConfig, IHeightQueryParams } from './types';

export class HeightApi extends HttpClient {
  public readonly limit: number;

  constructor(protected config: IHeightConfig) {
    const basePath = 'https://api.height.app';
    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        Authorization: `api-key ${config.apiKey}`,
      },
    };
    super(apiConfig);
    this.limit = config.limit;
  }

  public async sendGetRequest(path: HeightApiPath, queryParams?: IHeightQueryParams) {
    return this.get({
      path,
      queryParams,
    });
  }
}
