import { IWrikeConfig, IWrikeProject, IWrikeQueryParams, IWrikeTask, IWrikeUser } from './types';
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
    this.limit = config.limit ?? 1000;
  }

  protected async *getAllRecordsIterator(path: string, queryParams?: IWrikeQueryParams) {
    let nextPageToken: string | undefined = undefined;
    let isLast = false;
    const limit = this.limit;
    while (!isLast) {
      const params: IWrikeQueryParams = path.includes(WRIKE_PATHS.TASKS)
        ? { ...(queryParams ?? {}), nextPageToken, pageSize: limit }
        : { ...(queryParams ?? {}) };

      const response = await this.getRecords(path, params);
      isLast = !response.nextPageToken;
      nextPageToken = response.nextPageToken;
      yield { data: response.data, isLast };
    }
  }

  public getRecords(path: string, params?: IWrikeQueryParams) {
    return this.sendGetRequest(path, params);
  }

  protected async getAllRecords<T>(path: string, queryParams?: IWrikeQueryParams): Promise<T[]> {
    const iterator = this.getAllRecordsIterator(path, queryParams);
    let records: T[] = [];
    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk.data);
    }

    return records;
  }

  public getAllProjects() {
    return this.getAllRecords<IWrikeProject>(WRIKE_PATHS.PROJECTS, {
      fields: '[description]',
    });
  }

  public getAllUsers() {
    return this.getAllRecords<IWrikeUser>(WRIKE_PATHS.CONTACTS);
  }

  public getAllTasks() {
    return this.getAllRecords<IWrikeTask>(WRIKE_PATHS.TASKS, {
      fields: '[responsibleIds, parentIds, description]',
    });
  }

  public async sendGetRequest(path: string, queryParams?: IWrikeQueryParams) {
    return this.get({
      path,
      queryParams,
    });
  }
}
