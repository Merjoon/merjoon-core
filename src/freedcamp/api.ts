import { HttpClient } from '../common/HttpClient';
import { IFreedcampConfig, IFreedcampProjectsResponse } from './types';
import { IMerjoonApiConfig } from '../common/types';
import { FREEDCAMP_PATH } from './consts';

export class FreedcampApi extends HttpClient {
  constructor(protected config: IFreedcampConfig) {
    const basePath = 'https://freedcamp.com/api/v1/';
    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        'x-api-key': config.apiKey,
      },
    };
    super(apiConfig);
  }

  public async getProjects() {
    const { data } = await this.getRecords<IFreedcampProjectsResponse>(FREEDCAMP_PATH.PROJECTS);
    return data.projects;
  }
  public async getRecords<T>(path: string) {
    const response = await this.sendGetRequest<T>(path);
    return response.data;
  }
  protected async sendGetRequest<T>(path: string) {
    return this.get<T>({
      path,
    });
  }
}
