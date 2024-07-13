import { HttpClient } from '../common/HttpClient';
import { IRequestConfig } from '../common/types';
import { HeightApiPath, IHeightConfig, IHeightQueryParams } from './types';

export class HeightApi extends HttpClient {
  constructor(protected config: IHeightConfig) {
    const basePath = `https://api.height.app`;
    super(basePath);
  }

  public async sendGetRequest(
    path: HeightApiPath,
    queryParams?: IHeightQueryParams
  ) {
    const config: IRequestConfig = {
      headers: {
        Authorization: `api-key ${this.config.secret}`,
      },
    };

    try {
      return this.get({
        path,
        config,
        queryParams,
      });
    } catch (error) {
      console.log({ error });
    }
  }
}
