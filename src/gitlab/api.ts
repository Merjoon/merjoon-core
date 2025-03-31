import { HttpClient } from '../common/HttpClient';
import {
  IGitLabConfig,
  IGitLabQueryParams,
  IGitLabMember,
  IGitLabIssue,
  IGitLabProject,
  IGitLabGroup,
} from './types';
import { IMerjoonApiConfig } from '../common/types';
import { GITLAB_PATH } from './consts';

export class GitLabApi extends HttpClient {
  public readonly limit: number;
  constructor(protected config: IGitLabConfig) {
    const basePath = 'https://gitlab.com/api/v4';
    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        'PRIVATE-TOKEN': `${config.token}`,
      },
      httpAgent: { maxSockets: config.maxSockets },
    };
    super(apiConfig);
    this.limit = config.limit || 100;
  }
  async *getAllRecordsIterator<T>(path: string, queryParams?: IGitLabQueryParams) {
    let nextPage = 1;

    while (nextPage) {
      const params: IGitLabQueryParams = {
        ...queryParams,
        page: nextPage,
        per_page: this.limit,
      };
      const { data, headers } = await this.getRecords<T>(path, params);
      yield data;
      nextPage = Number(headers['x-next-page']);
    }
  }
  public getRecords<T>(path: string, params?: IGitLabQueryParams) {
    return this.sendGetRequest<T[]>(path, params);
  }
  protected async getAllRecords<T>(path: string, queryParams?: IGitLabQueryParams): Promise<T[]> {
    const iterator = this.getAllRecordsIterator<T>(path, queryParams);
    let records: T[] = [];

    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }

    return records;
  }

  public async getAllIssues() {
    return this.getAllRecords<IGitLabIssue>(GITLAB_PATH.ISSUES);
  }

  public getAllProjects() {
    return this.getAllRecords<IGitLabProject>(GITLAB_PATH.PROJECTS, {
      owned: true,
    });
  }

  public getAllGroups() {
    return this.getAllRecords<IGitLabGroup>(GITLAB_PATH.GROUPS);
  }
  public async getAllMembersByGroupId(id: string) {
    const path = GITLAB_PATH.MEMBERS(id);
    return this.getAllRecords<IGitLabMember>(path);
  }

  protected async sendGetRequest<T>(path: string, queryParams?: IGitLabQueryParams) {
    return this.get<T>({
      path,
      queryParams,
    });
  }
}
