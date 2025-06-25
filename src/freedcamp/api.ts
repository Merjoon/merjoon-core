import { createHmac } from 'node:crypto';
import { HttpClient } from '../common/HttpClient';
import {
  IFreedcampConfig,
  IFreedcampNewQueryParams,
  IFreedcampProjectsData,
  IFreedcampQueryParams,
  IFreedcampResponse,
  IFreedcampTask,
  IFreedcampTasksResponseData,
  IFreedcampUsersData,
} from './types';
import { IMerjoonApiConfig } from '../common/types';
import { FREEDCAMP_PATH } from './consts';

export class FreedcampApi extends HttpClient {
  public readonly limit: number;
  constructor(protected config: IFreedcampConfig) {
    const basePath = 'https://freedcamp.com/api/v1/';
    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        'x-api-key': config.apiKey,
      },
    };
    super(apiConfig);
    this.limit = config.limit || 200;
  }

  static getTimestamp() {
    return Math.floor(Date.now() / 1000).toString();
  }

  protected createAuthHash(algorithm: string, secret_key: string) {
    const hash = createHmac(algorithm, secret_key);
    const timestamp = FreedcampApi.getTimestamp();
    hash.update(this.config.apiKey + timestamp);
    return hash.digest('hex');
  }

  protected createNewAuthParams(queryParams?: IFreedcampQueryParams): IFreedcampNewQueryParams {
    const hash = this.createAuthHash('sha1', this.config.apiSecret);
    const timestamp = FreedcampApi.getTimestamp();
    return {
      ...queryParams,
      hash,
      timestamp,
    };
  }

  async *getAllTasksIterator(path: string) {
    let offset = 0;
    const limit = this.limit;
    let hasMore = true;
    while (hasMore) {
      const data = await this.getRecords<IFreedcampTasksResponseData>(path, {
        limit,
        offset,
      });
      yield data.tasks;
      offset += limit;
      hasMore = data.meta.has_more;
    }
  }
  public async getAllTasks() {
    const iterator = this.getAllTasksIterator(FREEDCAMP_PATH.TASKS);
    let records: IFreedcampTask[] = [];

    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }
    return records;
  }

  public async getProjects() {
    const { projects } = await this.getRecords<IFreedcampProjectsData>(FREEDCAMP_PATH.PROJECTS);
    return projects;
  }

  public async getUsers() {
    const { users } = await this.getRecords<IFreedcampUsersData>(FREEDCAMP_PATH.USERS);
    return users;
  }
  public async getRecords<T>(path: string, queryParams?: IFreedcampQueryParams) {
    const response = await this.sendGetRequest<IFreedcampResponse<T>>(path, queryParams);
    return response.data.data;
  }

  protected async sendGetRequest<T>(path: string, queryParams?: IFreedcampQueryParams) {
    const newParams = this.createNewAuthParams(queryParams);
    return this.get<T>({
      path,
      queryParams: newParams,
    });
  }
}
