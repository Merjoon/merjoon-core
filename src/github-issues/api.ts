import { HttpClient } from '../common/HttpClient';
import {
  IGithubIssuesConfig,
  IGithubIssuesMember,
  IGithubIssuesOrg,
  IGithubIssuesRepo,
} from './types';
import { IMerjoonApiConfig } from '../common/types';
import { GITHUB_ISSUES_PATH } from './consts';

export class GithubIssuesApi extends HttpClient {
  constructor(protected config: IGithubIssuesConfig) {
    const basePath = 'https://api.github.com';
    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        Authorization: `Bearer ${config.token}`,
      },
    };
    super(apiConfig);
  }
  public async getUserOrgs() {
    const response = await this.sendGetRequest<IGithubIssuesOrg[]>(GITHUB_ISSUES_PATH.ORGS);
    return response.data;
  }
  public async getReposByOrgId(id: string) {
    const path = GITHUB_ISSUES_PATH.REPOS(id);
    const response = await this.sendGetRequest<IGithubIssuesRepo[]>(path);
    return response.data;
  }
  public async getMembersByOrgId(id: string) {
    const path = GITHUB_ISSUES_PATH.MEMBERS(id);
    const response = await this.sendGetRequest<IGithubIssuesMember[]>(path);
    return response.data;
  }
  protected async sendGetRequest<T>(path: string) {
    return this.get<T>({
      path,
    });
  }
}
