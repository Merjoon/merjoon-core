import { HttpClient } from '../common/HttpClient';
import { IPlaneConfig, IPlaneProject, IPlaneIssue } from './types';
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
      httpAgent: { maxSockets: config.maxSockets },
    };
    super(apiConfig);
    this.limit = config.limit || 100;
  }

  public async getAllProjects(): Promise<IPlaneProject[]> {
    const data = await this.sendGetRequest(PLANE_PATH.PROJECTS);
    return data.results;
  }

  public async *getAllIssuesIterator(perPage = this.limit, cursor: string | null = null) {
    let nextCursor: string | null = cursor;
    let previousData: IPlaneIssue[] = [];
    let isLastPage = false;

    do {
      const queryParams = {
        per_page: perPage,
        ...(nextCursor && { cursor: nextCursor }),
        expand: 'state',
      };

      const projects = await this.getAllProjects();

      for (const project of projects) {
        const data = await this.sendGetRequest(
          `${PLANE_PATH.PROJECTS}/${project.id}/${PLANE_PATH.ISSUES}`,
          queryParams,
        );

        if (
          data.results.length === 0 ||
          JSON.stringify(previousData) === JSON.stringify(data.results)
        ) {
          isLastPage = true;
          break;
        }

        previousData = data.results;
        nextCursor = data.next_cursor || null;

        yield { data: data.results, isLast: !data.next_page_results };
      }
    } while (nextCursor && !isLastPage);
  }

  public async getAllIssues(): Promise<IPlaneIssue[]> {
    const iterator = this.getAllIssuesIterator();
    let allIssues: IPlaneIssue[] = [];

    for await (const { data } of iterator) {
      allIssues = allIssues.concat(data);
    }

    return allIssues;
  }
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  protected async sendGetRequest(path: string, queryParams?: Record<string, any>) {
    return this.get({ path, queryParams });
  }
}
