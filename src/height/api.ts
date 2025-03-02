import { HttpClient } from '../common/HttpClient';
import { IMerjoonApiConfig } from '../common/types';
import { HeightApiPath, IHeightConfig, IHeightQueryParams, IHeightTask } from './types';

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
    this.limit = config.limit || 100;
  }

  protected async *getAllTasksIterator(path: HeightApiPath): AsyncGenerator<IHeightTask[]> {
    let shouldStop = false;
    let lastRetrievedDate: string | null = null;

    const queryParams: IHeightQueryParams = {
      filters: '{}',
      limit: this.limit,
      usePagination: true,
    };

    do {
      try {
        this.prepareQueryParams(queryParams, lastRetrievedDate);

        const { list } = await this.sendGetRequest(path, queryParams);

        yield list;
        shouldStop = list.length < this.limit;

        if (list.length) {
          lastRetrievedDate = list[list.length - 1].createdAt;
        }
      } catch (e: unknown) {
        if (e instanceof Error) {
          throw new Error(e.message);
        } else {
          throw e;
        }
      }
    } while (!shouldStop);
  }
  public prepareQueryParams(queryParams: IHeightQueryParams, lastRetrievedDate: string | null) {
    if (lastRetrievedDate) {
      queryParams.filters = JSON.stringify({
        createdAt: {
          lt: {
            date: lastRetrievedDate,
          },
        },
      });
    }
  }
  public async getRecords(path: HeightApiPath) {
    const { list } = await this.sendGetRequest(path);
    return list;
  }
  public async getProjects() {
    return await this.getRecords(HeightApiPath.Lists);
  }
  public async getUsers() {
    return await this.getRecords(HeightApiPath.Users);
  }
  public async getAllTasks() {
    const iterator = this.getAllTasksIterator(HeightApiPath.Tasks);
    let records: IHeightTask[] = [];
    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }
    return records;
  }
  public async sendGetRequest(path: HeightApiPath, queryParams?: IHeightQueryParams) {
    return this.get({
      path,
      queryParams,
    });
  }
}
