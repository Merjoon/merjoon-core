import { HttpClient } from '../common/HttpClient';
import { IRequestConfig, IMerjoonApiConfig } from '../common/types';
import { HeightApiPath, IHeightConfig, IHeightQueryParams } from './types';

export class HeightApi extends HttpClient {
  public readonly limit: number;

  constructor(protected config: IHeightConfig) {
    const basePath = 'https://api.height.app';
    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        apiKey: config.apiKey,
      },
    };
    super(apiConfig);
    this.limit = config.limit;

  }

  public async sendGetRequest(
    path: HeightApiPath,
    queryParams?: IHeightQueryParams
  ) {
    const config: IRequestConfig = {
      headers: {
        Authorization: `api-key ${this.config.apiKey}`,
      },
    };

    return this.get({
      path,
      config,
      queryParams,
    });
  }
}
