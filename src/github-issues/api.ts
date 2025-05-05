import { HttpClient } from '../common/HttpClient';
import { IGithubIssuesConfig, IGithubIssuesQueryParams, IGithubIssuesRepo } from './types';
import { IMerjoonApiConfig } from '../common/types';
import { GITHUB_ISSUES_PATH } from './consts';

export class GithubIssuesApi extends HttpClient {
  public readonly limit: number;
  constructor(protected config: IGithubIssuesConfig) {
    const basePath = `https://api.github.com/orgs/${config.organization}`;
    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
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
        per_page: limit,
        page: currentPage,
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
  public async getAllRepos() {
    return this.getAllRecords<IGithubIssuesRepo>(GITHUB_ISSUES_PATH.REPOS);
  }
  public getRecords<T>(path: string, queryParams?: IGithubIssuesQueryParams) {
    return this.sendGetRequest<T[]>(path, queryParams);
  }
  protected async sendGetRequest<T>(path: string, queryParams?: IGithubIssuesQueryParams) {
    return this.get<T>({
      path,
      queryParams,
    });
  }
}
