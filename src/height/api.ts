import { HttpClient } from '../common/HttpClient';
import { IRequestConfig } from '../common/types';
import { HeightApiPath, IHeightConfig, IHeightQueryParams } from './types';

export class HeightApi extends HttpClient {
  constructor(protected config: IHeightConfig) {
    const basePath = 'https://api.height.app';
    super(basePath);
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
