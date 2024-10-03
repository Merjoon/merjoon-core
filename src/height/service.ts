import {
  IMerjoonProjects,
  IMerjoonService,
  IMerjoonTasks,
  IMerjoonUsers,
} from "../common/types";
import { HeightApi } from "./api";
import { HeightTransformer } from "./transformer";
import {
  HeightApiPath,
  IHeightList,
  IHeightQueryParams,
  IHeightTask,
  IHeightUser,
} from "./types";

export class HeightService implements IMerjoonService {
  constructor(
    public readonly api: HeightApi,
    public readonly transformer: HeightTransformer
  ) {}

  protected async *getAllRecordsIterator<T>(
    path: HeightApiPath,
    queryParams?: IHeightQueryParams
  ) {
    const { limit = 50 } = queryParams ?? {};
    let shouldStop = false;
    let currentPage = 1;

    do {
      try {
        const { list }: { list: T[] } = await this.api.sendGetRequest(path, {
          page: currentPage,
          limit,
          ...queryParams,
        });

        yield list;
        shouldStop = list.length < limit;
        currentPage++;
      } catch (e: unknown) {
        if (e instanceof Error) {
          throw new Error(e.message);
        } else {
          throw new Error("An unknown error occurred");
        }
      }
    } while (!shouldStop);
  }

  protected async getAllRecords<T>(
    path: HeightApiPath,
    queryParams?: IHeightQueryParams
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const iterator: AsyncGenerator<any> = this.getAllRecordsIterator<T>(
      path,
      queryParams
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

  private buildTaskQueryParams(): IHeightQueryParams {
    return {
      filters: `{}`,
      usePagination: true,
      order: `[{"column":"lastActivityAt","direction":"DESC"}]`,
    };
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    const queryParams = this.buildTaskQueryParams();
    const tasks = await this.getAllRecords<IHeightTask>(
      HeightApiPath.Tasks,
      queryParams
    );
    return this.transformer.transformTasks(tasks);
  }
}
