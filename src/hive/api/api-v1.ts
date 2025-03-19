import { IHiveConfig, IHiveUser, IHiveItem, IHiveQueryParams } from '../types';
import { HIVE_PATHS } from '../consts';
import { HttpClient } from '../../common/HttpClient';
import { IMerjoonApiConfig } from '../../common/types';

export class HiveApiV1 extends HttpClient {
  constructor(config: IHiveConfig) {
    const apiConfig: IMerjoonApiConfig = {
      baseURL: 'https://app.hive.com/api/v1',
      headers: {
        api_key: config.apiKey,
      },
    };
    super(apiConfig);
  }
  private async sendGetRequest<T>(path: string, queryParams?: IHiveQueryParams): Promise<T> {
    return this.get({
      path,
      queryParams,
    });
  }

  public async getWorkspaces(): Promise<IHiveItem[]> {
    return this.sendGetRequest<IHiveItem[]>(HIVE_PATHS.WORKSPACES);
  }

  public async getUsers(): Promise<IHiveUser[]> {
    return this.sendGetRequest<IHiveUser[]>(HIVE_PATHS.USERS);
  }
}
