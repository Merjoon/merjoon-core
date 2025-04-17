import { HttpClient } from '../common/HttpClient';
import {
  IMeisterConfig,
  IMeisterPersons,
  IMeisterProjects,
  IMeisterQueryParams,
  IMeisterTasks,
} from './type';
import { IMerjoonApiConfig } from '../common/types';
import { MEISTER_PATH } from './const';

export class MeisterApi extends HttpClient {
  public readonly limit: number;
  constructor(protected config: IMeisterConfig) {
    const basePath = 'https://www.meistertask.com/api';
    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        Authorization: `Bearer ${config.token}`,
      },
    };
    super(apiConfig);
    this.limit = config.limit || 500;
  }
  async *getAllIterator<T>(path: string) {
    let currentPage = 0;
    const limit = this.limit;
    let isLast = false;
    do {
      const { data } = await this.getRecords<T[]>(path, {
        items: limit,
        page: currentPage,
      });
      yield data;
      currentPage++;
      isLast = data.length < limit;
    } while (!isLast);
  }
  protected async getAllRecords<T>(path: string) {
    const iterator = this.getAllIterator<T>(path);
    let records: T[] = [];

    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }
    return records;
  }
  public async getAllTasks() {
    return this.getAllRecords<IMeisterTasks>(MEISTER_PATH.TASKS);
  }
  public async getAllProjects() {
    return this.getAllRecords<IMeisterProjects>(MEISTER_PATH.PROJECTS);
  }
  public async getPersons() {
    const { data } = await this.getRecords<IMeisterPersons[]>(MEISTER_PATH.PERSONS);
    return data;
  }
  public getRecords<T>(path: string, queryParams?: IMeisterQueryParams) {
    return this.sendGetRequest<T>(path, queryParams);
  }
  protected async sendGetRequest<T>(path: string, queryParams?: IMeisterQueryParams) {
    return this.get<T>({
      path,
      queryParams,
    });
  }
}
