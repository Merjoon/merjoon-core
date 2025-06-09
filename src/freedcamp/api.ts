import { HttpClient } from '../common/HttpClient';
import {
  IFreedcampConfig,
  IFreedcampProjectsData,
  IFreedcampResponse,
  IFreedcampUsersData,
} from './types';
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
    const { projects } = await this.getRecords<IFreedcampProjectsData>(FREEDCAMP_PATH.PROJECTS);
    return projects;
  }

  public async getUsers() {
    const { users } = await this.getRecords<IFreedcampUsersData>(FREEDCAMP_PATH.USERS);
    return users;
  }

  public async getRecords<T>(path: string): Promise<T> {
    const response = await this.sendGetRequest<IFreedcampResponse<T>>(path);
    return response.data.data;
  }

  protected async sendGetRequest<T>(path: string) {
    return this.get<T>({
      path,
    });
  }
}
