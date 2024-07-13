import {
  IMerjoonCollections,
  IMerjoonService,
  IMerjoonTasks,
  IMerjoonUsers,
} from '../common/types';
import { HeightApi } from './api';
import { HeightTransformer } from './transformer';
import { HeightApiPath, IHeightList, IHeightTask, IHeightUser } from './types';

export class HeightService implements IMerjoonService {
  constructor(
    public readonly api: HeightApi,
    public readonly transformer: HeightTransformer
  ) {}

  protected async *getAllRecordsIterator<T>(
    path: HeightApiPath,
    pageSize: number = 50
  ) {
    let shouldStop: boolean = false;
    let currentPage: number = 1;
    do {
      try {
        const { list }: { list: T[] } = await this.api.sendGetRequest(path);

        yield list;
        shouldStop = list.length < pageSize;
        currentPage++;
      } catch (e: any) {
        throw new Error(e.message);
      }
    } while (!shouldStop);
  }

  protected async getAllRecords<T>(path: HeightApiPath, pageSize: number = 50) {
    const iterator: AsyncGenerator<any> = this.getAllRecordsIterator<T>(
      path,
      pageSize
    );
    let records: T[] = [];

    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }

    return records;
  }

  public async getCollections(): Promise<IMerjoonCollections> {
    const projects = await this.getAllRecords<IHeightList>(
      HeightApiPath.Projects
    );
    return this.transformer.transformProjects(projects);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const people = await this.getAllRecords<IHeightUser>(HeightApiPath.People);
    return this.transformer.transformPeople(people);
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    const tasks = await this.getAllRecords<IHeightTask>(HeightApiPath.Tasks);
    return this.transformer.transformTasks(tasks);
  }
}
