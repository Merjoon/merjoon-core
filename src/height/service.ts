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
  IHeightGeneralType,
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

  protected async *getAllRecordsIterator(
    path: HeightApiPath,
    queryParams?: IHeightQueryParams
  ) {
    const { limit = 50 } = queryParams ?? {};
    let shouldStop = false;
    let lastRetrievedDate: string | null = null;

    do {
      try {
        // filters apply only to tasks
        // filters tasks created before lastRetrievedDate
        const filters = lastRetrievedDate
          ? { createdAt: { lt: { date: lastRetrievedDate } } }
          : {};

        // Orders from newest to oldest
        const orders = [{ column: "lastActivityAt", direction: "DESC" }];

        const { list }: { list: IHeightGeneralType[] } =
          await this.api.sendGetRequest(path, {
            limit,
            filters: JSON.stringify(filters),
            usePagination: true,
            order: JSON.stringify(orders),
            ...queryParams,
          });

        yield list;
        shouldStop = list.length < limit;

        // Update the lastRetrievedDate to the `createdAt` of the last record in the current batch
        if (list.length > 0) {
          lastRetrievedDate = list[list.length - 1].createdAt;
        }
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
    const iterator: AsyncGenerator<any> = this.getAllRecordsIterator(
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
