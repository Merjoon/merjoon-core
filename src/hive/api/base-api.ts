import { IHiveConfig, IHiveQueryParams } from '../types';
import { HttpClient } from '../../common/HttpClient';
import { IMerjoonApiConfig } from '../../common/types';

export abstract class BaseHiveApi extends HttpClient {
  constructor(basePath: string, config: IHiveConfig) {
    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        api_key: config.apiKey,
      },
      httpsAgent: { maxSockets: Number(config.httpsAgent) || 10 },
      useHttpsAgent: config.useHttpsAgent,
    };
    super(apiConfig);
  }

  protected async sendGetRequest(path: string, queryParams?: IHiveQueryParams) {
    return this.get({
      path,
      queryParams,
    });
  }
}
