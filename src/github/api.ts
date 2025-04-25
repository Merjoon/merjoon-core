import { HttpClient } from '../common/HttpClient';
import { IGithubConfig, IGithubRepo } from './types';
import { IMerjoonApiConfig } from '../common/types';
import { GITHUB_PATH } from './consts';

export class GithubApi extends HttpClient {
  constructor(protected config: IGithubConfig) {
    const basePath = `https://api.github.com/orgs/${config.subDomain}`;
    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        Authorization: config.apiKey,
      },
    };
    super(apiConfig);
  }

  public async getAllProjects() {
    const data = await this.sendGetRequest<IGithubRepo[]>(GITHUB_PATH.REPOS);
    return data;
  }
  protected async sendGetRequest<T>(path: string) {
    const response = await this.get<T>({
      path,
    });
    return response.data;
  }
}
