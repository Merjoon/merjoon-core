import { IWrikeConfig, IWrikeGetTasksResponse, IWrikeQueryParams, IWrikeTask } from './types';
import { IMerjoonApiConfig } from '../common/types';
import { HttpClient } from '../common/HttpClient';
import { WRIKE_PATHS } from './consts';

export class WrikeApi extends HttpClient {
  public readonly limit: number;

  constructor(protected config: IWrikeConfig) {
    const basePath = 'https://www.wrike.com/api/v4';
    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        Authorization: `Bearer ${config.token}`,
      },
    };
    super(apiConfig);
    this.limit = config.limit || 1000;
  }

  public async sendGetRequest(path: string, queryParams?: IWrikeQueryParams) {
    const response = await this.get({
      path,
      queryParams,
    });

    return response.data;
  }

  protected async *getAllTasksIterator() {
    let body = await this.getTasks({ pageSize: this.limit });
    let nextPageToken = body.nextPageToken;

    yield body.data;
    while (nextPageToken) {
      body = await this.getNext(nextPageToken);
      yield body.data;
      nextPageToken = body.nextPageToken;
    }
  }

  public async getAllTasks(): Promise<IWrikeTask[]> {
    const iterator = this.getAllTasksIterator();
    let records: IWrikeTask[] = [];
    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }

    return records;
  }

  public async getTasks(queryParams: IWrikeQueryParams): Promise<IWrikeGetTasksResponse> {
    const params = {
      ...queryParams,
      fields: '[responsibleIds, parentIds, description]',
    };
    return this.sendGetRequest(WRIKE_PATHS.TASKS, params);
  }

  public async getNext(nextPageToken: string): Promise<IWrikeGetTasksResponse> {
    const queryParams = { nextPageToken, pageSize: this.limit };
    return this.sendGetRequest(WRIKE_PATHS.TASKS, queryParams);
  }

  public getAllProjects() {
    return this.sendGetRequest(WRIKE_PATHS.PROJECTS);
  }

  public getAllUsers() {
    return this.sendGetRequest(WRIKE_PATHS.CONTACTS);
  }
}
