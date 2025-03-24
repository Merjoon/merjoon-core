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
  constructor(config: IHive2Config) {
    const apiConfig: IMerjoonApiConfig = {
      baseURL: 'https://app.hive.com/api/v2',
      headers: {
        api_key: config.apiKey,
      },
      httpAgent: { maxSockets: config.maxSockets },
    };
    super(apiConfig);
  }

  protected async *getAllItemsIterator<T>(
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

  protected async getAllItems<T>(path: string): Promise<T[]> {
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
  private async sendGetRequest<T>(
    path: string,
    queryParams?: IHiveQueryParams,
  ): Promise<IHiveV2Response<T>> {
    const response = await this.get({
      path,
      queryParams,
    });

    return response.data;
  }
}
