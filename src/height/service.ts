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
  private lastRetrievedDate: string | null = null;

  constructor(
    public readonly api: HeightApi,
    public readonly transformer: HeightTransformer
  ) {}

  protected async *getAllRecordsIterator(
    path: HeightApiPath,
    queryParams: IHeightQueryParams
  ): AsyncGenerator<IHeightTask[]> {
    let shouldStop = false;

    do {
      try {
        const { list } = await this.api.sendGetRequest(path, queryParams);

        yield list;
        shouldStop = list.length < queryParams.limit;

        if (list.length > 0) {
          this.lastRetrievedDate = list[list.length - 1].createdAt;
        }
      } catch (e: unknown) {
        if (e instanceof Error) {
          throw new Error(e.message);
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
    const filters = this.lastRetrievedDate
      ? { createdAt: { lt: { date: this.lastRetrievedDate } } }
      : {};

    const orders = [{ column: 'lastActivityAt', direction: 'DESC' }];

    const tasks = await this.getAllRecordsPaginated<IHeightTask>(
      HeightApiPath.Tasks,
      {
        filters: JSON.stringify(filters),
        order: JSON.stringify(orders),
        usePagination: true,
        limit: 50,
      }
    );
    return this.transformer.transformTasks(tasks);
  }
}
