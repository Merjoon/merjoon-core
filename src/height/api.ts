import { HttpClient } from '../common/HttpClient';
import { IMerjoonApiConfig } from '../common/types';
import { IHeightConfig, IHeightQueryParams, IHeightTask } from './types';
import { HEIGHT_PATH } from './consts';
export class HeightApi extends HttpClient {
  public readonly limit: number;

  constructor(protected config: IHeightConfig) {
    const basePath = 'https://api.height.app';
    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        Authorization: `api-key ${config.apiKey}`,
      },
    };
    super(apiConfig);
    this.limit = config.limit || 200;
  }

  protected async *getAllTasksIterator(): AsyncGenerator<IHeightTask[]> {
    let shouldStop = false;
    let lastRetrievedDate: string | null = null;

    do {
      const list = await this.getTasksSince(lastRetrievedDate);
      yield list;
      shouldStop = list.length < this.limit;

      if (list.length) {
        lastRetrievedDate = list[list.length - 1].createdAt;
      }
    } while (!shouldStop);
  }

  public async getTasksSince(lastRetrievedDate: string | null): Promise<IHeightTask[]> {
    const queryParams: IHeightQueryParams = {
      filters: '{}',
      limit: this.limit,
    };
    if (lastRetrievedDate) {
      queryParams.filters = JSON.stringify({
        createdAt: {
          lt: {
            date: lastRetrievedDate,
          },
        },
      });
    }

    return this.getRecords(HEIGHT_PATH.TASKS, queryParams);
  }
  public async getRecords(path: string, queryParams?: IHeightQueryParams) {
    const { list } = await this.sendGetRequest(path, queryParams);
    return list;
  }
  public async getProjects() {
    return this.getRecords(HEIGHT_PATH.LISTS);
  }
  public async getUsers() {
    return this.getRecords(HEIGHT_PATH.USERS);
  }
  public async getAllTasks() {
    const iterator = this.getAllTasksIterator();
    let records: IHeightTask[] = [];
    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }
    return records;
  }
  public async sendGetRequest(path: string, queryParams?: IHeightQueryParams) {
    return this.get({
      path,
      queryParams,
    });
  }
}
