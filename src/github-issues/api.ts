import { HttpClient } from '../common/HttpClient';
import {
  IGithubIssueQueryParams,
  IGithubIssuesConfig,
  IGithubIssuesMember,
  IGithubIssuesOrg,
  IGithubIssuesRepo,
  IGithubIssuesRepoIssue,
} from './types';
import { IMerjoonApiConfig } from '../common/types';
import { GITHUB_ISSUES_PATH } from './consts';

export class GithubIssuesApi extends HttpClient {
  public readonly limit: number;
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
    this.limit = config.limit || 30;
  }
  async *getAllIterator<T>(path: string) {
    let currentPage = 1;
    const limit = this.limit;
    let isLast = false;
    do {
      const { data } = await this.getRecords<T>(path, {
        page: currentPage,
        per_page: limit,
        sort: 'created_at',
      });
      yield data;
      currentPage++;
      isLast = data.length < limit;
    } while (!isLast);
  }
  protected async getAllRecords<T>(path: string) {
    const iterator = this.getAllIterator<T>(path);
    let records: T[] = [];

    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }
    return records;
  }
  public getRecords<T>(path: string, queryParams?: IGithubIssueQueryParams) {
    return this.sendGetRequest<T[]>(path, queryParams);
  }
  public async getRepoAllIssues(member: string, repository: string) {
    const path = GITHUB_ISSUES_PATH.REPO_ISSUES(member, repository);
    return this.getAllRecords<IGithubIssuesRepoIssue>(path);
  }
  public async getUserAllOrgs() {
    return this.getAllRecords<IGithubIssuesOrg>(GITHUB_ISSUES_PATH.USER_ORGS);
  }
  public async getAllReposByOrgId(id: number) {
    const path = GITHUB_ISSUES_PATH.ORG_REPOS(id);
    return this.getAllRecords<IGithubIssuesRepo>(path);
  }
  public async getAllMembersByOrgId(id: number) {
    const path = GITHUB_ISSUES_PATH.ORG_MEMBERS(id);
    return this.getAllRecords<IGithubIssuesMember>(path);
  }
  protected async sendGetRequest<T>(path: string, queryParams?: IGithubIssueQueryParams) {
    return this.get<T>({
      path,
      queryParams,
    });
  }
}
