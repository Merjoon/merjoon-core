import { HttpClient } from '../common/HttpClient';
import { IPlaneConfig, IPlaneQueryParams, IPlaneProject, IPlaneIssue } from './types';
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

  public async getAllProjects() {
    const data = await this.sendGetRequest<IPlaneResponse<IPlaneProject>>(PLANE_PATH.PROJECTS);
    return data.results;
  }

  protected async *getAllIssuesIterator(projectId: string): AsyncGenerator<IPlaneIssue[]> {
    let cursor: string | null = null;
    let prevCursor: string | null = null;

    do {
      const path = PLANE_PATH.ISSUES_BY_PROJECT_ID(projectId);
      const queryParams: IPlaneQueryParams = {
        per_page: this.limit,
        ...(cursor && { cursor }),
        expand: 'state',
      };

      const response = await this.sendGetRequest(path, queryParams);
      const results = response.results || [];

      yield results;

      prevCursor = cursor;
      cursor = response.next_cursor || null;

      if (cursor === prevCursor || results.length === 0) {
        break;
      }
    } while (cursor);
  }

  public async getAllIssues(projectId: string): Promise<IPlaneIssue[]> {
    const iterator = this.getAllIssuesIterator(projectId);
    let issues: IPlaneIssue[] = [];

    for await (const chunk of iterator) {
      issues = issues.concat(chunk);
    }

    return issues;
  }

  protected async sendGetRequest(path: string, queryParams?: IPlaneQueryParams) {
    const response = await this.get({ path, queryParams });
    return response.data;
  }
}
