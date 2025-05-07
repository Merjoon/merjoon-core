import { HttpClient } from '../common/HttpClient';
import { IFreedcampConfig, IFreedcampProject, IFreedcampProjectsResponse } from './types';
import { IMerjoonApiConfig } from '../common/types';
import { FREEDCAMP_PATH } from './consts';

export class FreedcampApi extends HttpClient {
  constructor(protected config: IFreedcampConfig) {
    const basePath = 'https://freedcamp.com/api/v1/';
    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        'x-api-key': config.token,
      },
    };
    super(apiConfig);
  }

  public async getAllProjects() {
    const response = await this.getRecords<IFreedcampProjectsResponse>(FREEDCAMP_PATH.PROJECTS);
    const { data } = response.data;
    const projects: IFreedcampProject[] = data.projects;
    return projects;
  }
  public getRecords<T>(path: string) {
    return this.sendGetRequest<T>(path);
  }
  protected async sendGetRequest<T>(path: string) {
    return this.get<T>({
      path,
    });
  }
}
