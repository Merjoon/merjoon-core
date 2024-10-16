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
  IHeightList,
  IHeightQueryParams,
  IHeightTask,
  IHeightUser,
} from './types';

export class HeightService implements IMerjoonService {

  constructor(
    public readonly api: HeightApi,
    public readonly transformer: HeightTransformer
  ) { }

  protected async *getAllRecordsIterator(
    path: HeightApiPath,
    queryParams: IHeightQueryParams
  ): AsyncGenerator<IHeightTask[]> {
    let shouldStop = false;
    let lastRetrievedDate: string | null = null;


    do {
      try {

        if (lastRetrievedDate) {
          queryParams.filters = JSON.stringify({
            createdAt: { lt: { date: lastRetrievedDate } },
          });
        }

        const { list } = await this.api.sendGetRequest(path, queryParams);

        yield list;
        shouldStop = list.length < queryParams.limit;

        if (list.length > 0) {
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

  protected async getAllRecords<IHeightGeneralType>(
    path: HeightApiPath,
    queryParams?: IHeightQueryParams
  ) {
    let records: IHeightGeneralType[] = [];

    const { list } = await this.api.sendGetRequest(path, queryParams);
    records = list;

    return records;
  }

  protected async getAllRecordsPaginated<IHeightGeneralType>(
    path: HeightApiPath,
    queryParams: IHeightQueryParams
  ) {
    let records: IHeightGeneralType[] = [];

    const iterator: AsyncGenerator<IHeightTask[]> = this.getAllRecordsIterator(
      path,
      queryParams
    );

    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk as IHeightGeneralType);
    }

    return records;
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    const lists = await this.getAllRecords<IHeightList>(HeightApiPath.Lists);
    return this.transformer.transformLists(lists);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const user = await this.getAllRecords<IHeightUser>(HeightApiPath.Users);
    return this.transformer.transformUsers(user);
  }

  public async getTasks(): Promise<IMerjoonTasks> {

    const orders = [{ column: 'lastActivityAt', direction: 'DESC' }];

    const tasks = await this.getAllRecordsPaginated<IHeightTask>(
      HeightApiPath.Tasks,
      {
        filters: '{}',
        order: JSON.stringify(orders),
        usePagination: true,
        limit: 200,
      }
    );
    return this.transformer.transformTasks(tasks);
  }
}
