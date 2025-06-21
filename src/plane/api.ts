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

  protected async *getAllIssuesIterator(projectId: string, expand: string[] = []) {
    let cursor = `${this.limit}:0:0`;
    let hasNextPage = true;

    do {
      const queryParams: IPlaneQueryParams = {
        per_page: this.limit,
        cursor,
      };

      if (expand.length) {
        queryParams.expand = expand.join(',');
      }

      const response = await this.getIssuesByProjectId(projectId, queryParams);
      const results = response.results || [];

      yield results;

      cursor = response.next_cursor;
      hasNextPage = response.next_page_results;
    } while (hasNextPage);
  }

  public async getAllIssues(projectId: string, expand: string[] = []) {
    const iterator = this.getAllIssuesIterator(projectId, expand);
    let issues: IPlaneIssue[] = [];

    for await (const chunk of iterator) {
      issues = issues.concat(chunk);
    }
    return issues;
  }

  public async getIssuesByProjectId(projectId: string, queryParams?: IPlaneQueryParams) {
    const path = PLANE_PATH.ISSUES(projectId);
    return this.sendGetRequest<IPlaneResponse<IPlaneIssue>>(path, queryParams);
  }

  protected async sendGetRequest<T>(path: string, queryParams?: IPlaneQueryParams) {
    const response = await this.get<T>({
      path,
      queryParams,
    });
    return response.data;
  }
}
