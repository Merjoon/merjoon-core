import { HttpClient } from '../common/HttpClient';
import { IMerjoonApiConfig } from '../common/types';
import {
  IHeightFilters,
  IHeightConfig,
  IHeightQueryParams,
  IHeightTask,
  IHeightList,
  IHeightUser,
  IHeightResponse,
} from './types';
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
      httpAgent: {
        maxSockets: config.maxSockets,
      },
    };
    super(apiConfig);
    this.limit = config.limit || 200;
  }

  protected async *getAllTasksIterator() {
    let shouldStop = false;
    let lastRetrievedDate: string | undefined;

    do {
      const list = await this.getTasksSince(lastRetrievedDate);
      yield list;
      shouldStop = list.length < this.limit;

      if (list.length) {
        lastRetrievedDate = list[list.length - 1].createdAt;
      }
    } while (!shouldStop);
  }

  public async getTasksSince(lastRetrievedDate?: string) {
    const filters: IHeightFilters = {};

    if (lastRetrievedDate) {
      filters.createdAt = {
        lt: {
          date: lastRetrievedDate,
        },
      };
    }

    const queryParams: IHeightQueryParams = {
      filters: JSON.stringify(filters),
      limit: this.limit,
    };
    return this.getRecords<IHeightTask>(HEIGHT_PATH.TASKS, queryParams);
  }

  public async getRecords<T>(path: string, queryParams?: IHeightQueryParams) {
    const { list } = await this.sendGetRequest<IHeightResponse<T>>(path, queryParams);
    return list;
  }

  public async getProjects() {
    return this.getRecords<IHeightList>(HEIGHT_PATH.LISTS);
  }

  public async getUsers() {
    return this.getRecords<IHeightUser>(HEIGHT_PATH.USERS);
  }

  public async getAllTasks() {
    const iterator = this.getAllTasksIterator();
    let records: IHeightTask[] = [];
    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }
    return records;
  }

  public async sendGetRequest<T>(path: string, queryParams?: IHeightQueryParams) {
    const response = await this.get<T>({
      path,
      queryParams,
    });

    return response.data;
  }
}
