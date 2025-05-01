import { HttpClient } from '../common/HttpClient';
import {
  IPlaneConfig,
  IPlaneQueryParams,
  IPlaneProject,
  IPlaneIssue,
  IPlaneResponse,
} from './types';
import { IMerjoonApiConfig } from '../common/types';
import { PLANE_PATH } from './consts';

export class PlaneApi extends HttpClient {
  public readonly limit: number;

  constructor(protected config: IPlaneConfig) {
    const basePath = `https://api.plane.so/api/v1/workspaces/${config.workspaceSlug}`;
    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        'X-API-Key': config.apiKey,
      },
    };
    super(apiConfig);
    this.limit = config.limit || 100;
  }

  public async getProjects() {
    const data = await this.sendGetRequest<IPlaneResponse<IPlaneProject>>(PLANE_PATH.PROJECTS);
    return data.results;
  }

  protected async *getAllIssuesIterator(projectId: string) {
    let cursor = `${this.limit}:0:0`;
    let nextPage = true;

    do {
      const path = PLANE_PATH.ISSUES(projectId);

      const queryParams: IPlaneQueryParams = {
        per_page: this.limit,
        expand: 'state',
        cursor,
      };

      const response = await this.getRecords<IPlaneResponse<IPlaneIssue>>(path, queryParams);
      const results = response.results || [];

      yield results;

      cursor = response.next_cursor;
      nextPage = response.next_page_results;
    } while (nextPage);
  }

  public async getAllIssues(projectId: string) {
    const iterator = this.getAllIssuesIterator(projectId);
    let issues: IPlaneIssue[] = [];

    for await (const chunk of iterator) {
      issues = issues.concat(chunk);
    }

    return issues;
  }

  public async getRecords<T>(path: string, queryParams?: IPlaneQueryParams): Promise<T> {
    return this.sendGetRequest<T>(path, queryParams);
  }

  protected async sendGetRequest<T>(path: string, queryParams?: IPlaneQueryParams) {
    const response = await this.get<T>({
      path,
      queryParams,
    });
    return response.data;
  }
}
