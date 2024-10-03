import {
  IMerjoonProjects,
  IMerjoonService,
  IMerjoonTasks,
  IMerjoonUsers,
} from "../common/types";
import { HeightApi } from "./api";
import { HeightTransformer } from "./transformer";
import { HeightApiPath, IHeightList, IHeightTask, IHeightUser } from "./types";

export class HeightService implements IMerjoonService {
  constructor(
    public readonly api: HeightApi,
    public readonly transformer: HeightTransformer
  ) {}

  protected async *getAllRecordsIterator<T>(
    path: HeightApiPath,
    pageSize = 50,
    queryParams?: Record<string, string>
  ) {
    let shouldStop = false;
    let currentPage = 1;
    do {
      try {
        const { list }: { list: T[] } = await this.api.sendGetRequest(path, {
          page: currentPage,
          pageSize,
          ...queryParams, // Include additional query parameters here
        });

        yield list;
        shouldStop = list.length < pageSize;
        currentPage++;
      } catch (e: any) {
        throw new Error(e.message);
      }
    } while (!shouldStop);
  }

  protected async getAllRecords<T>(path: HeightApiPath, pageSize = 50) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  public async getProjects(): Promise<IMerjoonProjects> {
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
