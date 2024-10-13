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
  ) {}

  protected async *getAllRecordsIterator(
    path: HeightApiPath,
    queryParams: IHeightQueryParams
  ): AsyncGenerator<IHeightTask[]> {
    let shouldStop = false;
    let lastRetrievedDate: string | null = null;

    do {
      try {
        const filters = lastRetrievedDate
          ? { createdAt: { lt: { date: lastRetrievedDate } } }
          : {};

        const { list } = await this.api.sendGetRequest(path, {
          filters: JSON.stringify(filters),
          ...queryParams,
        });

        yield list;
        shouldStop = list.length < queryParams.limit;

        if (list.length > 0) {
          lastRetrievedDate = list[list.length - 1].createdAt;
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

    if (queryParams?.usePagination) {
      const iterator: AsyncGenerator<IHeightTask[]> =
        this.getAllRecordsIterator(path, queryParams);

      for await (const nextChunk of iterator) {
        records = records.concat(nextChunk as IHeightGeneralType);
      }
    } else {
      const { list } = await this.api.sendGetRequest(path, queryParams);
      records = list;
    }

    return records;
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.getAllRecords<IHeightList>(HeightApiPath.Lists);
    return this.transformer.transformProjects(projects);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const people = await this.getAllRecords<IHeightUser>(HeightApiPath.Users);
    return this.transformer.transformPeople(people);
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    const tasks = await this.getAllRecords<IHeightTask>(HeightApiPath.Tasks, {
      usePagination: true,
      limit: 50,
      order: `[{"column":"lastActivityAt","direction":"DESC"}]`,
    });
    return this.transformer.transformTasks(tasks);
  }
}
