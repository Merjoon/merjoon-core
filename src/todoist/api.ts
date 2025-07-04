import type {
  ITodoistConfig,
  ITodoistResponse,
  ITodoistProject,
  ITodoistQueryParams,
  ITodoistCollaborator,
  ITodoistTask,
  ITodoistSection,
} from './types';
import type { IMerjoonApiConfig } from '../common/types';
import { HttpClient } from '../common/HttpClient';
import { TODOIST_PATHS } from './consts';

export class TodoistApi extends HttpClient {
  public readonly limit: number;

  constructor(config: ITodoistConfig) {
    const basePath = 'https://api.todoist.com/api/v1';
    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        Authorization: `Bearer ${config.token}`,
      },
      httpAgent: {
        maxSockets: config.maxSockets,
      },
    };
    super(apiConfig);
    this.limit = config.limit || 200;
  }

  protected async *getAllRecordsIterator<T>(path: string) {
    let nextCursor: string | undefined = undefined;

    do {
      const params: ITodoistQueryParams = {
        limit: this.limit,
      };
      if (nextCursor) {
        params.cursor = nextCursor;
      }
      const response = await this.getRecords<ITodoistResponse<T>>(path, params);
      yield response.results;
      nextCursor = response.next_cursor;
    } while (nextCursor);
  }

  protected async getAllRecords<T>(path: string) {
    const iterator = this.getAllRecordsIterator<T>(path);
    let records: T[] = [];

    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }

    return records;
  }

  public async getRecords<T>(path: string, params?: ITodoistQueryParams) {
    return this.sendGetRequest<T>(path, params);
  }

  public async getAllProjects() {
    return this.getAllRecords<ITodoistProject>(TODOIST_PATHS.PROJECTS);
  }

  public async getAllCollaborators(projectId: string) {
    const path = TODOIST_PATHS.COLLABORATORS(projectId);
    return this.getAllRecords<ITodoistCollaborator>(path);
  }

  public async getAllTasks() {
    return this.getAllRecords<ITodoistTask>(TODOIST_PATHS.TASKS);
  }

  public async getAllSections() {
    return this.getAllRecords<ITodoistSection>(TODOIST_PATHS.SECTIONS);
  }

  public async sendGetRequest<T>(path: string, queryParams?: ITodoistQueryParams): Promise<T> {
    const response = await this.get<T>({
      path,
      queryParams,
    });
    return response.data;
  }
}
