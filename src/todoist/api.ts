import type {
  ITodoistConfig,
  ITodoistResponse,
  ITodoistProject,
  ITodoistQueryParams,
  ITodoistUser,
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


  //projects
  public async getProjects(
    queryParams: ITodoistQueryParams,
  ): Promise<ITodoistResponse<ITodoistProject>> {
    return this.sendGetRequest<ITodoistResponse<ITodoistProject>>(
      TODOIST_PATHS.PROJECTS,
      queryParams,
    );
  }

  public async getNextProjects(next_cursor: string): Promise<ITodoistResponse<ITodoistProject>> {
    const queryParams: ITodoistQueryParams = {
      cursor: next_cursor,
      limit: this.limit,
    };
    return this.getProjects(queryParams);
  }

  protected async *getAllProjectsIterator(): AsyncGenerator<ITodoistProject[], void> {
    let response = await this.getProjects({ limit: this.limit });
    let next_cursor = response.next_cursor;
    yield response.results;

    while (next_cursor) {
      response = await this.getNextProjects(next_cursor);
      yield response.results;
      next_cursor = response.next_cursor;
    }
  }

  public async getAllProjects(): Promise<ITodoistProject[]> {
    const iterator = this.getAllProjectsIterator();
    const allProjects: ITodoistProject[] = [];

    for await (const project of iterator) {
      allProjects.push(...project);
    }

    return allProjects;
  }

  //users
  public async getProjectUsers(
    projectId: string,
    queryParams?: ITodoistQueryParams,
  ): Promise<ITodoistResponse<ITodoistUser>> {
    const path = `projects/${projectId}/collaborators`;
    return this.sendGetRequest<ITodoistResponse<ITodoistUser>>(path, queryParams);
  }

  public async *getAllProjectUsersIterator(
    projectId: string,
  ): AsyncGenerator<ITodoistUser[], void> {
    let response = await this.getProjectUsers(projectId, { limit: this.limit });
    let next_cursor = response.next_cursor;
    yield response.results;

    while (next_cursor) {
      response = await this.getProjectUsers(projectId, {
        limit: this.limit,
        cursor: next_cursor,
      });
      yield response.results;
      next_cursor = response.next_cursor;
    }
  }

  public async getAllProjectUsers(projectId: string): Promise<ITodoistUser[]> {
    const iterator = this.getAllProjectUsersIterator(projectId);
    const allUsers: ITodoistUser[] = [];

    for await (const users of iterator) {
      allUsers.push(...users);
    }

    return allUsers;
  }

//generics
  public async sendGetRequest<T>(path: string, queryParams?: ITodoistQueryParams): Promise<T> {
    const response = await this.get<T>({
      path,
      queryParams,
    });
    return response.data;
  }
}
