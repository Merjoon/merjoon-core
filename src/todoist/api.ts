import { HttpClient } from '../common/HttpClient';
import { IMerjoonApiConfig } from '../common/types';
import { TODOIST_PATHS } from './const';
import { ITodoistConfig, ITodoistResponse } from './types';

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
  };

  protected async sendGetRequest<T>(path: string) {
    return this.get<T[]>({
      path,
    });
  };
  public async getAllProjects() {
    const { data } = await this.sendGetRequest<ITodoistResponse>(TODOIST_PATHS.PROJECTS);
    return data;
  }
}
