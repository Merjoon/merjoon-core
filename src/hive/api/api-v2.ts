import {
  IHiveV2Response,
  IHiveAction,
  IHiveProject,
  IHiveQueryParams,
  IHive2Config,
} from '../types';
import { HIVE_PATHS } from '../consts';
import { HttpClient } from '../../common/HttpClient';
import { IMerjoonApiConfig } from '../../common/types';

export class HiveApiV2 extends HttpClient {
  public readonly limit: number;
  constructor(config: IHive2Config) {
    const apiConfig: IMerjoonApiConfig = {
      baseURL: 'https://app.hive.com/api/v2',
      headers: {
        api_key: config.apiKey,
      },
      httpAgent: { maxSockets: config.maxSockets },
    };
    super(apiConfig);

    this.limit = config.limit || 50;
  }

  protected async *getAllItemsIterator<T>(path: string) {
    let startCursor, hasNextPage;
    do {
      const data: IHiveV2Response<T> = await this.getRecords<T>(path, {
        first: this.limit,
        after: startCursor,
      });
      yield data;
      hasNextPage = data.pageInfo.hasNextPage;
      startCursor = data.pageInfo.endCursor;
    } while (hasNextPage);
  }

  public async getRecords<T>(path: string, queryParams: IHiveQueryParams) {
    return this.sendGetRequest<IHiveV2Response<T>>(path, queryParams);
  }

  protected async getAllItems<T>(path: string) {
    const iterator = this.getAllItemsIterator<T>(path);
    let records: T[] = [];

    for await (const nextChunk of iterator) {
      const nodes: T[] = nextChunk.edges.map((edge) => edge.node);
      records = records.concat(nodes);
    }

    return records;
  }

  public async getWorkspaceProjects(workspaceId: string) {
    return this.getAllItems<IHiveProject>(HIVE_PATHS.PROJECTS(workspaceId));
  }

  public async getWorkspaceActions(workspaceId: string) {
    return this.getAllItems<IHiveAction>(HIVE_PATHS.ACTIONS(workspaceId));
  }
  private async sendGetRequest<T>(path: string, queryParams?: IHiveQueryParams) {
    const response = await this.get<T>({
      path,
      queryParams,
    });

    return response.data;
  }
}
