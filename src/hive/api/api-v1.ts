import { IHiveUser, IHiveItem, IHiveQueryParams, IHive1Config } from '../types';
import { HIVE_PATHS } from '../consts';
import { HttpClient } from '../../common/HttpClient';
import { IMerjoonApiConfig } from '../../common/types';

export class HiveApiV1 extends HttpClient {
  constructor(config: IHive1Config) {
    const apiConfig: IMerjoonApiConfig = {
      baseURL: 'https://app.hive.com/api/v1',
      headers: {
        api_key: config.apiKey,
      },
    };
    super(apiConfig);
  }
  protected async sendGetRequest<T>(path: string, queryParams?: IHiveQueryParams) {
    const response = await this.get<T>({
      path,
      queryParams,
    });

    return response.data;
  }

  public async getWorkspaces() {
    return this.sendGetRequest<IHiveItem[]>(HIVE_PATHS.WORKSPACES);
  }

  public async getUsers() {
    return this.sendGetRequest<IHiveUser[]>(HIVE_PATHS.USERS);
  }
}
