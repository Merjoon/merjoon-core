import {
  IHiveConfig,
  IHiveV2Response,
  IHiveAction,
  IHiveProject,
  IHiveQueryParams,
} from '../types';
import { HIVE_PATHS } from '../consts';
import { HttpClient } from '../../common/HttpClient';
import { IMerjoonApiConfig } from '../../common/types';

export class HiveApiV2 extends HttpClient {
  constructor(config: IHiveConfig) {
    const apiConfig: IMerjoonApiConfig = {
      baseURL: 'https://app.hive.com/api/v2',
      headers: {
        api_key: config.apiKey,
      },
      httpAgent: { maxSockets: config.maxSockets },
    };
    super(apiConfig);
  }

  private async sendGetRequest<T>(path: string, queryParams?: IHiveQueryParams): Promise<T> {
    return this.get({
      path,
      queryParams,
    });
  }

  private async *getAllItemsIterator<T>(
    path: string,
    limit = 50,
  ): AsyncGenerator<IHiveV2Response<T>> {
    let startCursor, hasNextPage;
    do {
      const data: IHiveV2Response<T> = await this.sendGetRequest(path, {
        first: limit,
        after: startCursor,
      });
      yield data;
      hasNextPage = data.pageInfo.hasNextPage;
      startCursor = data.pageInfo.endCursor;
    } while (hasNextPage);
  }

  private async getAllItems<T>(path: string): Promise<T[]> {
    const iterator = this.getAllItemsIterator<T>(path);
    let records: T[] = [];

    for await (const nextChunk of iterator) {
      const nodes: T[] = nextChunk.edges.map((edge) => edge.node);
      records = records.concat(nodes);
    }

    return records;
  }

  public async getWorkspaceProjects(workspaceId: string): Promise<IHiveProject[]> {
    return this.getAllItems<IHiveProject>(HIVE_PATHS.PROJECTS(workspaceId));
  }

  public async getWorkspaceActions(workspaceId: string): Promise<IHiveAction[]> {
    return this.getAllItems<IHiveAction>(HIVE_PATHS.ACTIONS(workspaceId));
  }
}
