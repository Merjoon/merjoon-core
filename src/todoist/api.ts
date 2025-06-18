import type {
  ITodoistConfig,
  ITodoistResponse,
  ITodoistProject,
  ITodoistQueryParams,
} from './types';
import type { IMerjoonApiConfig } from '../common/types';
import { HttpClient } from '../common/HttpClient';
import { TODOIST_PATHS } from './consts';

export class TodoistApi extends HttpClient {
  protected readonly limit: number;

  constructor(protected config: ITodoistConfig) {
    const basePath = 'https://api.todoist.com/api/v1';
    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        Authorization: `Bearer ${config.token}`,
      },
    };
    super(apiConfig);
    this.limit = config.limit || 1;
  }

  protected async *getAllProjectsIterator(): AsyncGenerator<ITodoistProject[], void> {
    let response = await this.getProjects({
      limit: this.limit,
    });
    let next_cursor = response.next_cursor;
    yield response.results;

    while (next_cursor) {
      response = await this.getNextProjects(next_cursor);
      yield response.results;
      next_cursor = response.next_cursor;
    }
  }

  public async getNextProjects(next_cursor: string): Promise<ITodoistResponse<ITodoistProject>> {
    const queryParams: ITodoistQueryParams = {
      cursor: next_cursor,
      limit: this.limit,
    };
    return this.sendGetRequest<ITodoistResponse<ITodoistProject>>(
      TODOIST_PATHS.PROJECTS,
      queryParams,
    );
  }

  public async sendGetRequest<T>(path: string, queryParams?: ITodoistQueryParams): Promise<T> {
    const response = await this.get<T>({
      path,
      queryParams,
    });
    return response.data;
  }

  public async getProjects(
    queryParams: ITodoistQueryParams,
  ): Promise<ITodoistResponse<ITodoistProject>> {
    return this.sendGetRequest<ITodoistResponse<ITodoistProject>>(
      TODOIST_PATHS.PROJECTS,
      queryParams,
    );
  }

  public async getAllProjects(): Promise<ITodoistProject[]> {
    const iterator = this.getAllProjectsIterator();
    const allProjects: ITodoistProject[] = [];

    for await (const project of iterator) {
      allProjects.push(...project);
    }

    return allProjects;
  }
}
