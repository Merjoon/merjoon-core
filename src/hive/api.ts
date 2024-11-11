import { IHiveConfig, IHiveQueryParams, IHiveV2Response, IHiveAction, IHiveProject, } from './types';
import { HttpClient } from '../common/HttpClient';
import { IMerjoonApiConfig } from '../common/types';
import { HIVE_PATHS } from './consts';

abstract class BaseHiveApi extends HttpClient {
  constructor(basePath: string, config: IHiveConfig) {
    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        'api_key': config.apiKey,
      },
    };
    super(apiConfig);
  }

  protected async sendGetRequest(path: string, queryParams?: IHiveQueryParams) {
    return this.get({
      path,
      queryParams
    });
  }
}

export class HiveApiV1 extends BaseHiveApi {
  constructor(config: IHiveConfig) {
    super('https://app.hive.com/api/v1', config);
  }

  public async getWorkspaces() {
    return this.sendGetRequest(HIVE_PATHS.WORKSPACES);
  }

  public async getUsers(workspaceId: string) {
    return this.sendGetRequest(HIVE_PATHS.USERS(workspaceId));
  }
}

export class HiveApiV2 extends BaseHiveApi {
  constructor(config: IHiveConfig) {
    super('https://app.hive.com/api/v2', config);
  }

  protected async* getAllItemsIterator(path: string, limit = 50): AsyncGenerator<IHiveV2Response> {
    let startCursor = '';
    let hasNextPage = true;
    do {
      const data: IHiveV2Response = await this.sendGetRequest(path, {
        first: limit,
        after: startCursor,
      });
      yield data;
      hasNextPage = data.pageInfo.hasNextPage;
      startCursor = data.pageInfo.endCursor;
    } while (hasNextPage);
  }

  protected async getAllItems<T>(path: string): Promise<T[]> {
    const iterator = this.getAllItemsIterator(path);
    const records: T[] = [];

    for await (const nextChunk of iterator) {
      records.push(...nextChunk.edges.map(edge => edge.node));
    }

    return records;
  }

  public async getProjects(workspaceId: string) {
    return this.getAllItems<IHiveProject>(HIVE_PATHS.PROJECTS(workspaceId));
  }

  public async getActions(workspaceId: string) {
    return this.getAllItems<IHiveAction>(HIVE_PATHS.ACTIONS(workspaceId));
  }
}
