import {
  IMerjoonProjects,
  IMerjoonService,
  IMerjoonTasks,
  IMerjoonUsers,
} from '../common/types';
import { HeightApi } from './api';
import { HeightTransformer } from './transformer';
import {
  HeightApiPath,
  IHeightQueryParams,
  IHeightTask
} from './types';

export class HeightService implements IMerjoonService {
  constructor(
    public readonly api: HeightApi,
    public readonly transformer: HeightTransformer
  ) { }

  protected async *getAllTasksIterator(
    path: HeightApiPath,
  ): AsyncGenerator<IHeightTask[]> {
    let shouldStop = false;
    let lastRetrievedDate: string | null = null;

    const queryParams: IHeightQueryParams = {
      filters: '{}',
      limit: this.api.limit,
      usePagination: true
    };

    do {
      try {
        if (lastRetrievedDate) {
          queryParams.filters = JSON.stringify({
            createdAt: {
              lt: {
                date: lastRetrievedDate 
              } 
            },
          });
        }

        const { list } = await this.api.sendGetRequest(path, queryParams);

        yield list;
        shouldStop = list.length < this.api.limit;

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

  protected async getAllRecords(path: HeightApiPath) {
    const { list } = await this.api.sendGetRequest(path);
    return list;
  }

  public async init(){
    return;
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    const lists = await this.getAllRecords(HeightApiPath.Lists);
    return this.transformer.transformLists(lists);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const user = await this.getAllRecords(HeightApiPath.Users);
    return this.transformer.transformUsers(user);
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    const iterator = this.getAllTasksIterator(HeightApiPath.Tasks);
    let tasks: IHeightTask[] = [];

    for await (const nextChunk of iterator) {
      tasks = tasks.concat(nextChunk);
    }

    return this.transformer.transformTasks(tasks);
  }
}
