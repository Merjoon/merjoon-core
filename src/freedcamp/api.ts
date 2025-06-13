import { HttpClient } from '../common/HttpClient';
import {
  IFreedcampConfig,
  IFreedcampProjectsData,
  IFreedcampQueryParams,
  IFreedcampResponse,
  IFreedcampTask,
  IFreedcampTasksData,
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

  async *getAllIterator(path: string) {
    let offset = 0;
    const limit = this.limit;
    let isLast = false;
    do {
      const data = await this.getRecords<IFreedcampTasksData>(path, {
        limit,
        offset,
      });
      yield data.tasks;
      offset += limit;
      isLast = data.tasks.length < limit;
    } while (!isLast);
  }
  protected async getAllTasksRecords(path: string) {
    const iterator = this.getAllIterator(path);
    let records: IFreedcampTask[] = [];

    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }
    return records;
  }

  public async getAllTasks() {
    return this.getAllTasksRecords(FREEDCAMP_PATH.TASKS);
  }

  public async getProjects() {
    const { projects } = await this.getRecords<IFreedcampProjectsData>(FREEDCAMP_PATH.PROJECTS);
    return projects;
  }

  public async getUsers() {
    const { users } = await this.getRecords<IFreedcampUsersData>(FREEDCAMP_PATH.USERS);
    return users;
  }
  public async getRecords<T>(path: string, queryParams?: IFreedcampQueryParams): Promise<T> {
    const response = await this.sendGetRequest<IFreedcampResponse<T>>(path, queryParams);
    return response.data.data;
  }

  protected async sendGetRequest<T>(path: string, queryParams?: IFreedcampQueryParams) {
    return this.get<T>({
      path,
      queryParams,
    });
  }
}
