import { IWrikeConfig, IWrikeQueryParams, IWrikeTask, IWrikeTaskResponse } from './types';
import { IMerjoonApiConfig } from '../common/types';
import { HttpClient } from '../common/HttpClient';
import { WRIKE_PATHS } from './consts';

export class WrikeApi extends HttpClient {
  public readonly limit: number;

  constructor(config: IWrikeConfig) {
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
    return this.get({
      path,
      queryParams,
    });
  }

  protected async *getAllTasksIterator() {
    let body = await this.getTasks({ pageSize: this.limit });
    let nextPageToken: string | null = body.nextPageToken;
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

  public async getTasks(queryParamsObject: object) {
    const queryParams = {
      ...queryParamsObject,
      fields: '[responsibleIds, parentIds, description]',
    };
    return this.sendGetRequest(WRIKE_PATHS.TASKS, queryParams);
  }

  public async getNext(nextPageToken: string): Promise<IWrikeTaskResponse> {
    const queryParams = { nextPageToken, pageSize: this.limit };
    return this.sendGetRequest(WRIKE_PATHS.TASKS, queryParams);
  }

  public getAllProjects() {
    return this.sendGetRequest(WRIKE_PATHS.PROJECTS, {
      fields: '[description]',
    });
  }

  public getAllUsers() {
    return this.sendGetRequest(WRIKE_PATHS.CONTACTS);
  }
}
