import { IHiveConfig, IHiveQueryParams, IHiveV2Response, IHiveAction, IHiveProject, } from './types';
import { HttpClient } from '../common/HttpClient';
import { IMerjoonApiConfig } from '../common/types';
import { HIVE_PATHS } from './consts';

export class HiveApi extends HttpClient {
  protected workspaceIds: string[] | undefined;

  constructor(protected config: IHiveConfig) {
    const basePath = 'https://app.hive.com/api';
    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        'Authorization': config.apiKey,
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

  public async getWorkspaces() {
    const path = HIVE_PATHS.WORKSPACES;
    const response = await this.sendGetRequest(path);
    return response;
  }

  public async getUsers(workspaceId: string) {
    const path = HIVE_PATHS.USERS(workspaceId);
    const response = await this.sendGetRequest(path);
    return response;
  }

  public async getProjects(workspaceId: string) {
    const path = HIVE_PATHS.PROJECTS(workspaceId);
    const iterator = this.getAllItemsIterator(path);
    let records: IHiveProject[] = [];

    for await (const nextChunk of iterator) {
      const projects: IHiveProject[] = nextChunk.edges.map(edge => edge.node);
      records = records.concat(projects);
    }
    return records;
  }

  public async getActions(workspaceId: string) {
    const path = HIVE_PATHS.ACTIONS(workspaceId);
    const iterator = this.getAllItemsIterator(path);
    let records: IHiveAction[] = [];

    for await (const nextChunk of iterator) {
      const actions: IHiveAction[] = nextChunk.edges.map(edge => edge.node);
      records = records.concat(actions);
    }
    return records;
  }
};
