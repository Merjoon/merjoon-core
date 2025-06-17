import type { ITodoistConfig, ITodoistResponse, ITodoistProject } from './types';
import type { IMerjoonApiConfig } from '../common/types';
import { HttpClient } from '../common/HttpClient';
import { TODOIST_PATHS } from './consts';

export class TodoistApi extends HttpClient {
  constructor(protected config: ITodoistConfig) {
    const basePath = 'https://api.todoist.com/rest/v2';
    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        Authorization: `Bearer ${config.token}`,
      },
    };
    super(apiConfig);
  }

  public async sendGetRequest(path: string): Promise<ITodoistProject[]> {
    const response: ITodoistResponse<ITodoistProject> = await this.get({
      path,
    });

    return response.data;
  }

  public getAllProjects(): Promise<ITodoistProject[]> {
    return this.sendGetRequest(TODOIST_PATHS.PROJECTS);
  }
}
