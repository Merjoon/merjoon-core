import { HiveApiPath, IHiveConfig, IHiveItem, IHiveQueryParams } from './types';
import { HttpClient } from '../common/HttpClient';
import { IRequestConfig } from '../common/types';

export class HiveApi extends HttpClient {

  protected readonly apiKey: string;
  protected readonly userId: string;
  protected workspaceIds: string[] | undefined;

  constructor(protected config: IHiveConfig) {
    const basePath = 'https://app.hive.com/api/v1/workspaces';
    super(basePath);
    this.apiKey = config.apiKey;
    this.userId = config.userId;
  }

  protected async getItems(path: HiveApiPath) {
    const config: IRequestConfig = {
      headers: {
        'api_key': `${this.apiKey}`,
        'user_id': `${this.userId}`,
      }
    };

    const result = await this.get({
      path,
      config,
    });

    if (!result) {
      throw new Error('Failed to fetch result');
    }
    return result;
  }

  protected async getIds(items: IHiveItem[]) {
    return items?.map((item: IHiveItem) => item.id) || [];
  }

  public async init() {
    const items = await this.getItems(HiveApiPath.Workspaces);
    this.workspaceIds = await this.getIds(items);
  }

  public async sendGetRequest(path: HiveApiPath | string, queryParams?: IHiveQueryParams) {
    if (!this.workspaceIds) {
      throw new Error('workspaceId not found');
    }
    const config: IRequestConfig = {
      headers: {
        'api_key': `${this.apiKey}`,
        'user_id': `${this.userId}`,
      }
    };

    const results = (await Promise.all(this.workspaceIds?.map(async (workspaceId) => {
      path = `${workspaceId}/` + path;
      return await this.get({
        path,
        config,
        queryParams,
      });
    }))).flat();
    if (!results) {
      throw new Error('Failed to get results');
    }
    return results;
  }
};
