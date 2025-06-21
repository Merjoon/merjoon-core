import { HttpClient } from '../common/HttpClient';
import {
  IGithubIssuesConfig,
  IGithubIssuesMember,
  IGithubIssuesOrg,
  IGithubIssuesRepo,
  IGithubIssuesRepoIssues,
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
        'X-GitHub-Api-Version': '2022-11-28',
      },
    };
    super(apiConfig);
  }
  public async getUserOrgs() {
    return this.sendGetRequest<IGithubIssuesOrg[]>(GITHUB_ISSUES_PATH.USER_ORGS);
  }
  public async getReposByOrgId(id: string) {
    const path = GITHUB_ISSUES_PATH.ORG_REPOS(id);
    return this.sendGetRequest<IGithubIssuesRepo[]>(path);
  }
  public async getMembersByOrgId(id: string) {
    const path = GITHUB_ISSUES_PATH.ORG_MEMBERS(id);
    return this.sendGetRequest<IGithubIssuesMember[]>(path);
  }
  public async getRepoIssues(owner: string, repository: string) {
    const path = GITHUB_ISSUES_PATH.REPO_ISSUES(owner, repository);
    return this.sendGetRequest<IGithubIssuesRepoIssues[]>(path);
  }
  protected async sendGetRequest<T>(path: string) {
    const response = await this.get<T>({
      path,
    });
    return response.data;
  }
}
